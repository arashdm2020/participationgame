# ParticipationGame - Setup Script for Windows
# نصب و راه‌اندازی خودکار پروژه

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Participation Game - Setup Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# بررسی نصب Git
Write-Host "[1/5] Checking Git installation..." -ForegroundColor Yellow
if (Get-Command git -ErrorAction SilentlyContinue) {
    Write-Host "✓ Git is installed" -ForegroundColor Green
    git --version
} else {
    Write-Host "✗ Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}

Write-Host ""

# بررسی نصب Foundry
Write-Host "[2/5] Checking Foundry installation..." -ForegroundColor Yellow
if (Get-Command forge -ErrorAction SilentlyContinue) {
    Write-Host "✓ Foundry is installed" -ForegroundColor Green
    forge --version
} else {
    Write-Host "✗ Foundry is not installed!" -ForegroundColor Red
    Write-Host "Installing Foundry..." -ForegroundColor Yellow
    
    try {
        # دانلود و نصب foundryup
        Invoke-WebRequest -Uri "https://foundry.paradigm.xyz" -OutFile "foundryup"
        .\foundryup
        Remove-Item "foundryup"
        Write-Host "✓ Foundry installed successfully" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed to install Foundry automatically" -ForegroundColor Red
        Write-Host "Please install manually: https://book.getfoundry.sh/getting-started/installation" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# نصب Dependencies
Write-Host "[3/5] Installing dependencies..." -ForegroundColor Yellow

$dependencies = @(
    "OpenZeppelin/openzeppelin-contracts-upgradeable",
    "OpenZeppelin/openzeppelin-contracts",
    "smartcontractkit/chainlink",
    "foundry-rs/forge-std"
)

foreach ($dep in $dependencies) {
    Write-Host "Installing $dep..." -ForegroundColor Gray
    forge install $dep --no-commit 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ $dep installed" -ForegroundColor Green
    } else {
        Write-Host "⚠ $dep already installed or failed" -ForegroundColor Yellow
    }
}

Write-Host ""

# کامپایل قرارداد
Write-Host "[4/5] Building contracts..." -ForegroundColor Yellow
forge build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Contracts compiled successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Compilation failed" -ForegroundColor Red
    exit 1
}

Write-Host ""

# اجرای تست‌ها
Write-Host "[5/5] Running tests..." -ForegroundColor Yellow
forge test

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ All tests passed" -ForegroundColor Green
} else {
    Write-Host "⚠ Some tests failed" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Setup completed!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy .env.example to .env and fill in your values" -ForegroundColor White
Write-Host "   cp .env.example .env" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Get testnet tokens:" -ForegroundColor White
Write-Host "   - ETH: https://faucet.quicknode.com/arbitrum/sepolia" -ForegroundColor Gray
Write-Host "   - LINK: https://faucets.chain.link/arbitrum-sepolia" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Setup Chainlink VRF:" -ForegroundColor White
Write-Host "   https://vrf.chain.link/arbitrum-sepolia" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Deploy contracts:" -ForegroundColor White
Write-Host "   forge script script/Deploy.s.sol --rpc-url `$env:ARBITRUM_SEPOLIA_RPC_URL --broadcast" -ForegroundColor Gray
Write-Host ""
Write-Host "For detailed instructions, see SETUP_GUIDE_WINDOWS.md" -ForegroundColor Cyan
