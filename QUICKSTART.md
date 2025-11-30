# ⚡ راهنمای سریع - 5 دقیقه تا اجرا!

## 📋 پیش‌نیازها
- ✅ Windows 10/11
- ✅ اتصال اینترنت
- ✅ 500 MB فضای خالی

---

## 🚀 نصب خودکار (توصیه می‌شود)

### مرحله 1: اجرای Setup Script

```powershell
# راست‌کلیک روی پوشه پروژه → Open in Terminal (PowerShell)
# سپس اجرا کنید:

.\setup.ps1
```

اگر خطای execution policy دریافت کردید:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup.ps1
```

---

## 🔧 نصب دستی (اگر script کار نکرد)

### 1️⃣ نصب Foundry

```powershell
# در PowerShell:
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 2️⃣ نصب Dependencies

```powershell
cd "C:\Users\abdi1\Desktop\Participation Game"

forge install OpenZeppelin/openzeppelin-contracts-upgradeable --no-commit
forge install OpenZeppelin/openzeppelin-contracts --no-commit
forge install smartcontractkit/chainlink --no-commit
forge install foundry-rs/forge-std --no-commit
```

### 3️⃣ Build & Test

```powershell
forge build
forge test
```

---

## 🌐 راه‌اندازی Testnet

### 1️⃣ دریافت توکن‌های تست (رایگان!)

**ETH Arbitrum Sepolia:**
```
🔗 https://faucet.quicknode.com/arbitrum/sepolia
```

**LINK (برای VRF):**
```
🔗 https://faucets.chain.link/arbitrum-sepolia
```

### 2️⃣ راه‌اندازی Chainlink VRF

1. رفتن به: https://vrf.chain.link/arbitrum-sepolia
2. Connect Wallet
3. Create Subscription
4. Add Funds (2 LINK)
5. کپی کردن Subscription ID

### 3️⃣ کانفیگ .env

```powershell
# کپی کردن template
cp .env.example .env

# ویرایش با Notepad
notepad .env
```

**پر کردن مقادیر:**
```bash
PRIVATE_KEY=your_metamask_private_key_without_0x
VRF_SUBSCRIPTION_ID=your_subscription_id
PLATFORM_FEE_WALLET=your_wallet_address
ARBISCAN_API_KEY=get_from_arbiscan.io
```

---

## 🚢 دیپلوی قرارداد

### مرحله 1: دیپلوی Mock LUSD

```powershell
# Load environment
$env:PRIVATE_KEY="your_private_key"
$env:ARBITRUM_SEPOLIA_RPC_URL="https://sepolia-rollup.arbitrum.io/rpc"

# Deploy Mock LUSD
forge create src/mocks/MockLUSD.sol:MockLUSD `
  --rpc-url $env:ARBITRUM_SEPOLIA_RPC_URL `
  --private-key $env:PRIVATE_KEY

# کپی آدرس و اضافه به .env:
# LUSD_TOKEN_ADDRESS=0x...
```

### مرحله 2: Mint LUSD برای خودتان

```powershell
# Mint 10,000 LUSD
cast send YOUR_MOCK_LUSD_ADDRESS `
  "faucet(uint256)" `
  10000000000000000000000 `
  --rpc-url $env:ARBITRUM_SEPOLIA_RPC_URL `
  --private-key $env:PRIVATE_KEY
```

### مرحله 3: دیپلوی ParticipationGame

```powershell
forge script script/Deploy.s.sol:DeployParticipationGame `
  --rpc-url $env:ARBITRUM_SEPOLIA_RPC_URL `
  --broadcast `
  --verify
```

### مرحله 4: اضافه کردن Consumer به VRF

1. رفتن به: https://vrf.chain.link/arbitrum-sepolia
2. باز کردن Subscription خود
3. Add Consumer → آدرس Proxy که دیپلوی شد
4. Confirm

---

## ✅ تست قرارداد

### Approve LUSD

```powershell
$PROXY="0x_YOUR_PROXY_ADDRESS"
$LUSD="0x_YOUR_MOCK_LUSD_ADDRESS"

cast send $LUSD `
  "approve(address,uint256)" `
  $PROXY `
  1000000000000000000000000 `
  --rpc-url $env:ARBITRUM_SEPOLIA_RPC_URL `
  --private-key $env:PRIVATE_KEY
```

### خرید Share

```powershell
cast send $PROXY `
  "buyShares(uint256,address)" `
  100000000000000000000 `
  0x0000000000000000000000000000000000000000 `
  --rpc-url $env:ARBITRUM_SEPOLIA_RPC_URL `
  --private-key $env:PRIVATE_KEY
```

### چک کردن Game

```powershell
# Game Details
cast call $PROXY "getGameDetails(uint256)" 1 --rpc-url $env:ARBITRUM_SEPOLIA_RPC_URL

# Your Shares
cast call $PROXY "getParticipant(uint256,address)" 1 YOUR_WALLET --rpc-url $env:ARBITRUM_SEPOLIA_RPC_URL
```

---

## 🔍 مشاهده در Explorer

```
Arbitrum Sepolia Explorer:
https://sepolia.arbiscan.io/
```

آدرس قرارداد خود را جستجو کنید و تراکنش‌ها را ببینید!

---

## 🆘 مشکل دارید؟

### خطاهای رایج:

**"forge: command not found"**
```powershell
# باز کردن مجدد PowerShell بعد از نصب Foundry
```

**"insufficient funds"**
```
دریافت ETH بیشتر از Faucet
```

**"VRF subscription not funded"**
```
اضافه کردن LINK به Subscription
```

**"nonce too low"**
```powershell
# Reset account nonce در MetaMask:
# Settings → Advanced → Reset Account
```

---

## 📚 اطلاعات بیشتر

- 📖 راهنمای کامل: `SETUP_GUIDE_WINDOWS.md`
- 🔍 بررسی پیاده‌سازی: `IMPLEMENTATION_CHECKLIST.md`
- 📝 مستندات: `README.md`

---

## ✨ موفق باشید!

اگر مشکلی داشتید:
1. راهنمای کامل را مطالعه کنید
2. لاگ خطا را چک کنید
3. تست‌ها را مجدداً اجرا کنید: `forge test -vvvv`

**🎉 بعد از دیپلوی موفق، قرارداد شما آماده استفاده است!**
