# Manual Deployment Script for Participation Game
# دیپلوی دستی گام به گام

param(
    [string]$Network = "sepolia",
    [switch]$SkipMockLUSD = $false
)

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Participation Game - Manual Deploy" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Load .env file
if (Test-Path .env) {
    Write-Host "Loading .env file..." -ForegroundColor Yellow
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^=]+)=(.+)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            Set-Item -Path "env:$key" -Value $value
        }
    }
    Write-Host "✓ Environment variables loaded" -ForegroundColor Green
} else {
    Write-Host "✗ .env file not found!" -ForegroundColor Red
    Write-Host "Please copy .env.example to .env and fill in your values" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Validate required variables
$required = @(
    "PRIVATE_KEY",
    "ARBITRUM_SEPOLIA_RPC_URL",
    "VRF_SUBSCRIPTION_ID",
    "PLATFORM_FEE_WALLET"
)

$missing = @()
foreach ($var in $required) {
    if (-not (Test-Path "env:$var")) {
        $missing += $var
    }
}

if ($missing.Count -gt 0) {
    Write-Host "✗ Missing required environment variables:" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    exit 1
}

Write-Host "✓ All required variables are set" -ForegroundColor Green
Write-Host ""

# Network configuration
$RPC_URL = $env:ARBITRUM_SEPOLIA_RPC_URL
$VRF_COORDINATOR = "0x50d47e4142598E3411aA864e08a44284e471AC6f"
$VRF_KEY_HASH = "0x027f94ff1465b3525f9fc03e9ff7d6d2c0953482246dd6ae07570c45d6631414"

Write-Host "Network Configuration:" -ForegroundColor Cyan
Write-Host "  RPC: $RPC_URL" -ForegroundColor Gray
Write-Host "  VRF Coordinator: $VRF_COORDINATOR" -ForegroundColor Gray
Write-Host "  VRF Subscription ID: $env:VRF_SUBSCRIPTION_ID" -ForegroundColor Gray
Write-Host ""

# Step 1: Deploy Mock LUSD (if needed)
if (-not $SkipMockLUSD) {
    Write-Host "[1/4] Deploying Mock LUSD..." -ForegroundColor Yellow
    
    $lusdDeploy = forge create src/mocks/MockLUSD.sol:MockLUSD `
        --rpc-url $RPC_URL `
        --private-key $env:PRIVATE_KEY `
        2>&1
    
    if ($LASTEXITCODE -eq 0) {
        $lusdAddress = ($lusdDeploy | Select-String -Pattern "Deployed to: (0x[a-fA-F0-9]{40})" | ForEach-Object { $_.Matches.Groups[1].Value })
        Write-Host "✓ Mock LUSD deployed at: $lusdAddress" -ForegroundColor Green
        
        # Update .env
        $envContent = Get-Content .env
        $envContent = $envContent -replace "LUSD_TOKEN_ADDRESS=.*", "LUSD_TOKEN_ADDRESS=$lusdAddress"
        $envContent | Set-Content .env
        $env:LUSD_TOKEN_ADDRESS = $lusdAddress
        
        Write-Host "  Updated .env with LUSD address" -ForegroundColor Gray
    } else {
        Write-Host "✗ Failed to deploy Mock LUSD" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[1/4] Skipping Mock LUSD deployment (using existing)" -ForegroundColor Yellow
    if (-not $env:LUSD_TOKEN_ADDRESS) {
        Write-Host "✗ LUSD_TOKEN_ADDRESS not set in .env!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Step 2: Deploy Implementation
Write-Host "[2/4] Deploying ParticipationGame Implementation..." -ForegroundColor Yellow

$implDeploy = forge create src/ParticipationGame.sol:ParticipationGame `
    --rpc-url $RPC_URL `
    --private-key $env:PRIVATE_KEY `
    --constructor-args $VRF_COORDINATOR `
    2>&1

if ($LASTEXITCODE -eq 0) {
    $implAddress = ($implDeploy | Select-String -Pattern "Deployed to: (0x[a-fA-F0-9]{40})" | ForEach-Object { $_.Matches.Groups[1].Value })
    Write-Host "✓ Implementation deployed at: $implAddress" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to deploy implementation" -ForegroundColor Red
    Write-Host $implDeploy -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Prepare initialization data
Write-Host "[3/4] Preparing proxy deployment..." -ForegroundColor Yellow

$initialCap = "10000000000000000000000" # 10,000 LUSD

# Encode VRFConfig struct
$vrfConfigEncoded = (cast abi-encode `
    "f(address,uint64,uint32,bytes32,uint16)" `
    $VRF_COORDINATOR `
    $env:VRF_SUBSCRIPTION_ID `
    500000 `
    $VRF_KEY_HASH `
    3)

# Encode initialize function
$initData = (cast calldata `
    "initialize(uint256,(address,uint64,uint32,bytes32,uint16),address,address,address)" `
    $initialCap `
    $vrfConfigEncoded `
    $env:LUSD_TOKEN_ADDRESS `
    $env:PLATFORM_FEE_WALLET `
    (cast wallet address --private-key $env:PRIVATE_KEY))

Write-Host "  Initial cap: 10,000 LUSD" -ForegroundColor Gray
Write-Host "  LUSD token: $env:LUSD_TOKEN_ADDRESS" -ForegroundColor Gray
Write-Host "  Fee wallet: $env:PLATFORM_FEE_WALLET" -ForegroundColor Gray

Write-Host ""

# Step 4: Deploy Proxy
Write-Host "[4/4] Deploying UUPS Proxy..." -ForegroundColor Yellow

$proxyDeploy = forge create lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol:ERC1967Proxy `
    --rpc-url $RPC_URL `
    --private-key $env:PRIVATE_KEY `
    --constructor-args $implAddress $initData `
    2>&1

if ($LASTEXITCODE -eq 0) {
    $proxyAddress = ($proxyDeploy | Select-String -Pattern "Deployed to: (0x[a-fA-F0-9]{40})" | ForEach-Object { $_.Matches.Groups[1].Value })
    Write-Host "✓ Proxy deployed at: $proxyAddress" -ForegroundColor Green
    
    # Update .env
    $envContent = Get-Content .env
    $envContent = $envContent -replace "PROXY_ADDRESS=.*", "PROXY_ADDRESS=$proxyAddress"
    $envContent | Set-Content .env
    
    Write-Host "  Updated .env with Proxy address" -ForegroundColor Gray
} else {
    Write-Host "✗ Failed to deploy proxy" -ForegroundColor Red
    Write-Host $proxyDeploy -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Deployment Summary" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Mock LUSD:      $env:LUSD_TOKEN_ADDRESS" -ForegroundColor White
Write-Host "Implementation: $implAddress" -ForegroundColor White
Write-Host "Proxy:          $proxyAddress" -ForegroundColor White
Write-Host ""
Write-Host "Explorer: https://sepolia.arbiscan.io/address/$proxyAddress" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Mint LUSD for testing:" -ForegroundColor White
Write-Host "   cast send $env:LUSD_TOKEN_ADDRESS 'faucet(uint256)' 10000000000000000000000 --rpc-url $RPC_URL --private-key `$env:PRIVATE_KEY" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Add Consumer to VRF Subscription:" -ForegroundColor White
Write-Host "   Go to: https://vrf.chain.link/arbitrum-sepolia" -ForegroundColor Gray
Write-Host "   Add Consumer: $proxyAddress" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Set operator (optional):" -ForegroundColor White
Write-Host "   cast send $proxyAddress 'setOperator(address,bool)' YOUR_OPERATOR_ADDRESS true --rpc-url $RPC_URL --private-key `$env:PRIVATE_KEY" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Approve LUSD and buy shares:" -ForegroundColor White
Write-Host "   cast send $env:LUSD_TOKEN_ADDRESS 'approve(address,uint256)' $proxyAddress 1000000000000000000000000 --rpc-url $RPC_URL --private-key `$env:PRIVATE_KEY" -ForegroundColor Gray
Write-Host "   cast send $proxyAddress 'buyShares(uint256,address)' 100000000000000000000 0x0000000000000000000000000000000000000000 --rpc-url $RPC_URL --private-key `$env:PRIVATE_KEY" -ForegroundColor Gray
Write-Host ""
Write-Host "✨ Deployment completed successfully!" -ForegroundColor Green
