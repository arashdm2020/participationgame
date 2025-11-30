# 🚀 راهنمای کامل راه‌اندازی روی Windows 10 - Arbitrum Sepolia

## 📋 فهرست مطالب
1. [پیش‌نیازها](#پیشنیازها)
2. [نصب Foundry](#نصب-foundry)
3. [راه‌اندازی پروژه](#راهاندازی-پروژه)
4. [دریافت توکن‌های تست](#دریافت-توکنهای-تست)
5. [راه‌اندازی Chainlink VRF](#راهاندازی-chainlink-vrf)
6. [کانفیگ محیط](#کانفیگ-محیط)
7. [دیپلوی قرارداد](#دیپلوی-قرارداد)
8. [تست قرارداد](#تست-قرارداد)

---

## 1️⃣ پیش‌نیازها

### الف) نصب Git
```powershell
# دانلود از:
https://git-scm.com/download/win

# بعد از نصب، تست کنید:
git --version
```

### ب) نصب Node.js (اختیاری اما توصیه می‌شود)
```powershell
# دانلود LTS از:
https://nodejs.org/

# تست:
node --version
npm --version
```

### ج) ایجاد کیف پول MetaMask
1. نصب اکستنشن MetaMask: https://metamask.io/
2. ایجاد کیف پول جدید
3. **حتماً Seed Phrase را ذخیره کنید!**
4. کپی کردن Private Key (Settings → Security & Privacy → Reveal Private Key)

⚠️ **هشدار امنیتی:** این کیف پول فقط برای تست است. هرگز Private Key واقعی خود را استفاده نکنید!

---

## 2️⃣ نصب Foundry روی Windows

### روش 1: استفاده از Foundryup (توصیه می‌شود)

```powershell
# در PowerShell با دسترسی Administrator اجرا کنید:

# 1. دانلود Foundryup
curl -L https://foundry.paradigm.xyz | bash

# 2. بستن و باز کردن مجدد PowerShell

# 3. نصب Foundry
foundryup

# 4. تست نصب
forge --version
cast --version
anvil --version
```

### روش 2: استفاده از WSL (اگر روش 1 کار نکرد)

```powershell
# 1. فعال‌سازی WSL
wsl --install

# 2. نصب Ubuntu از Microsoft Store

# 3. در Ubuntu terminal:
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc
foundryup
```

### روش 3: دانلود مستقیم Binary

```powershell
# دانلود از GitHub Releases:
https://github.com/foundry-rs/foundry/releases

# دانلود فایل‌های:
# - forge.exe
# - cast.exe
# - anvil.exe

# قرار دادن در مسیر (مثلاً C:\foundry\) و اضافه کردن به PATH
```

---

## 3️⃣ راه‌اندازی پروژه

```powershell
# 1. رفتن به پوشه پروژه
cd "C:\Users\abdi1\Desktop\Participation Game"

# 2. نصب Dependencies
forge install OpenZeppelin/openzeppelin-contracts-upgradeable --no-commit
forge install OpenZeppelin/openzeppelin-contracts --no-commit
forge install smartcontractkit/chainlink --no-commit
forge install foundry-rs/forge-std --no-commit

# 3. کامپایل قرارداد
forge build

# 4. اجرای تست‌ها (local)
forge test -vvv
```

**خروجی موفق باید شبیه این باشد:**
```
[⠢] Compiling...
[⠆] Compiling 50 files with 0.8.20
[⠰] Solc 0.8.20 finished in 3.21s
Compiler run successful!
```

---

## 4️⃣ دریافت توکن‌های تست

### الف) اضافه کردن Arbitrum Sepolia به MetaMask

```
Network Name: Arbitrum Sepolia
RPC URL: https://sepolia-rollup.arbitrum.io/rpc
Chain ID: 421614
Currency Symbol: ETH
Block Explorer: https://sepolia.arbiscan.io/
```

### ب) دریافت ETH تست (برای Gas)

**روش 1: Arbitrum Faucet (توصیه می‌شود)**
```
https://faucet.quicknode.com/arbitrum/sepolia
```
- وارد سایت شوید
- آدرس کیف پول خود را وارد کنید
- 0.01 ETH دریافت می‌کنید

**روش 2: Chainlink Faucet**
```
https://faucets.chain.link/arbitrum-sepolia
```
- احراز هویت با GitHub یا Twitter
- 0.1 ETH دریافت کنید

**روش 3: Alchemy Faucet**
```
https://sepoliafaucet.com/
```
- ابتدا ETH Sepolia دریافت کنید
- سپس از Bridge استفاده کنید: https://bridge.arbitrum.io/

### ج) دریافت LUSD تست

⚠️ **مشکل:** LUSD در Arbitrum Sepolia وجود ندارد!

**راه‌حل‌ها:**

**گزینه 1: استفاده از Mock LUSD (توصیه می‌شود برای تست)**
```solidity
// یک ERC20 ساده دیپلوی کنید که Mock LUSD باشد
```

دیپلوی Mock LUSD:
```powershell
# من یک قرارداد Mock LUSD برایت می‌سازم (پایین صفحه)
forge create src/mocks/MockLUSD.sol:MockLUSD \
  --rpc-url $ARBITRUM_SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --verify
```

**گزینه 2: استفاده از USDC/USDT تست**
- از Faucet دریافت کنید: https://faucet.circle.com/

**گزینه 3: دیپلوی در Mainnet (هزینه‌دار)**
- استفاده از LUSD واقعی در Arbitrum Mainnet

---

## 5️⃣ راه‌اندازی Chainlink VRF

### مرحله 1: ساخت Subscription

1. رفتن به: https://vrf.chain.link/arbitrum-sepolia
2. Connect Wallet (MetaMask)
3. کلیک روی "Create Subscription"
4. تأیید تراکنش
5. کپی کردن **Subscription ID**

### مرحله 2: شارژ Subscription با LINK

1. دریافت LINK تست از: https://faucets.chain.link/arbitrum-sepolia
2. در صفحه Subscription خود، کلیک روی "Add Funds"
3. مقدار: حداقل 2 LINK
4. تأیید تراکنش

### مرحله 3: اطلاعات VRF Arbitrum Sepolia

```
VRF Coordinator: 0x50d47e4142598E3411aA864e08a44284e471AC6f
Key Hash: 0x027f94ff1465b3525f9fc03e9ff7d6d2c0953482246dd6ae07570c45d6631414
```

---

## 6️⃣ کانفیگ محیط (.env)

```powershell
# 1. کپی کردن .env.example
cp .env.example .env

# 2. ویرایش .env با Notepad
notepad .env
```

**محتوای .env:**
```bash
# Private Key کیف پول تست (بدون 0x)
PRIVATE_KEY=your_private_key_here

# RPC URLs
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
ARBITRUM_MAINNET_RPC_URL=https://arb1.arbitrum.io/rpc

# Token Addresses
LUSD_TOKEN_ADDRESS=0x... # آدرس Mock LUSD که دیپلوی می‌کنید
PLATFORM_FEE_WALLET=0x... # آدرس کیف پولی که می‌خواهید فی را دریافت کنید

# Chainlink VRF
VRF_COORDINATOR_ADDRESS=0x50d47e4142598E3411aA864e08a44284e471AC6f
VRF_KEY_HASH=0x027f94ff1465b3525f9fc03e9ff7d6d2c0953482246dd6ae07570c45d6631414
VRF_SUBSCRIPTION_ID=123 # ID که از Chainlink دریافت کردید

# Arbiscan API Key (برای Verify)
ARBISCAN_API_KEY=your_api_key_here # از https://arbiscan.io/myapikey
```

---

## 7️⃣ دیپلوی قرارداد

### مرحله 1: دیپلوی Mock LUSD (اگر لازم است)

```powershell
# Load environment variables
$env:PRIVATE_KEY="your_private_key"
$env:ARBITRUM_SEPOLIA_RPC_URL="https://sepolia-rollup.arbitrum.io/rpc"

# Deploy Mock LUSD
forge create src/mocks/MockLUSD.sol:MockLUSD `
  --rpc-url $env:ARBITRUM_SEPOLIA_RPC_URL `
  --private-key $env:PRIVATE_KEY `
  --verify `
  --etherscan-api-key $env:ARBISCAN_API_KEY

# کپی کردن آدرس و قرار دادن در .env
```

### مرحله 2: Mint کردن LUSD برای تست

```powershell
# Mint 10,000 LUSD برای خودتان
cast send 0x_MOCK_LUSD_ADDRESS `
  "mint(address,uint256)" `
  YOUR_WALLET_ADDRESS `
  10000000000000000000000 `
  --rpc-url $env:ARBITRUM_SEPOLIA_RPC_URL `
  --private-key $env:PRIVATE_KEY
```

### مرحله 3: دیپلوی ParticipationGame

```powershell
# روش 1: استفاده از Script (توصیه می‌شود)
forge script script/Deploy.s.sol:DeployParticipationGame `
  --rpc-url $env:ARBITRUM_SEPOLIA_RPC_URL `
  --broadcast `
  --verify `
  --etherscan-api-key $env:ARBISCAN_API_KEY

# یا روش 2: دستی (اگر script کار نکرد)
# این را در مراحل بعدی توضیح می‌دهم
```

### خروجی موفق:

```
== Logs ==
Implementation deployed at: 0x1234...
Proxy deployed at: 0x5678...
Deployer set as operator

=== Deployment Summary ===
Network: Arbitrum Sepolia
Implementation: 0x1234...
Proxy (use this): 0x5678...
Owner: 0xYourAddress
LUSD Token: 0xMockLUSD
Platform Fee Wallet: 0xYourAddress
Initial Cap: 10000 LUSD
```

### مرحله 4: اضافه کردن Consumer به VRF Subscription

```powershell
# در وب‌سایت Chainlink VRF:
# 1. رفتن به Subscription خود
# 2. کلیک روی "Add Consumer"
# 3. وارد کردن آدرس Proxy که دیپلوی شد
# 4. تأیید تراکنش
```

---

## 8️⃣ تست قرارداد

### الف) تست Local

```powershell
# اجرای همه تست‌ها
forge test -vvv

# اجرای تست خاص
forge test --match-test test_BuyShares -vvvv

# Coverage Report
forge coverage
```

### ب) تست روی Testnet

```powershell
# 1. Approve LUSD برای قرارداد
cast send $LUSD_ADDRESS `
  "approve(address,uint256)" `
  $PROXY_ADDRESS `
  115792089237316195423570985008687907853269984665640564039457584007913129639935 `
  --rpc-url $ARBITRUM_SEPOLIA_RPC_URL `
  --private-key $PRIVATE_KEY

# 2. خرید Share
cast send $PROXY_ADDRESS `
  "buyShares(uint256,address)" `
  100000000000000000000 `
  0x0000000000000000000000000000000000000000 `
  --rpc-url $ARBITRUM_SEPOLIA_RPC_URL `
  --private-key $PRIVATE_KEY

# 3. چک کردن Game Details
cast call $PROXY_ADDRESS `
  "getGameDetails(uint256)" 1 `
  --rpc-url $ARBITRUM_SEPOLIA_RPC_URL

# 4. چک کردن Participant
cast call $PROXY_ADDRESS `
  "getParticipant(uint256,address)" 1 YOUR_ADDRESS `
  --rpc-url $ARBITRUM_SEPOLIA_RPC_URL
```

---

## 🛠️ عیب‌یابی مشکلات رایج

### مشکل 1: "forge: command not found"
```powershell
# راه‌حل: اضافه کردن به PATH
# Settings → System → Advanced → Environment Variables
# اضافه کردن مسیر Foundry به Path
```

### مشکل 2: "insufficient funds for gas"
```powershell
# راه‌حل: دریافت ETH بیشتر از Faucet
https://faucet.quicknode.com/arbitrum/sepolia
```

### مشکل 3: "VRF subscription not funded"
```powershell
# راه‌حل: اضافه کردن LINK به Subscription
https://vrf.chain.link/arbitrum-sepolia
```

### مشکل 4: "transaction underpriced"
```powershell
# راه‌حل: اضافه کردن --gas-price
cast send ... --gas-price 1000000000
```

---

## 📚 منابع مفید

### داکیومنتیشن
- Foundry: https://book.getfoundry.sh/
- Arbitrum: https://docs.arbitrum.io/
- Chainlink VRF: https://docs.chain.link/vrf/v2/introduction

### Explorers
- Arbitrum Sepolia: https://sepolia.arbiscan.io/
- Transactions: جستجو با hash تراکنش

### Faucets
- ETH: https://faucet.quicknode.com/arbitrum/sepolia
- LINK: https://faucets.chain.link/arbitrum-sepolia

### Tools
- ABI Encoder: https://abi.hashex.org/
- Unit Converter: https://eth-converter.com/

---

## ✅ Checklist نهایی

قبل از دیپلوی Production:

- [ ] تمام تست‌ها Pass شده‌اند
- [ ] Code Audit شده است
- [ ] VRF Subscription شارژ شده (حداقل 5 LINK)
- [ ] Platform Fee Wallet صحیح است
- [ ] Gas Price محاسبه شده
- [ ] Backup از Private Key گرفته شده
- [ ] پیکربندی Multisig برای Owner
- [ ] Monitoring و Alerting راه‌اندازی شده

---

## 🎯 مراحل بعدی

1. **دیپلوی اولیه** روی Sepolia
2. **تست کامل** همه functionها
3. **Audit امنیتی** توسط تیم حرفه‌ای
4. **دیپلوی نهایی** روی Arbitrum Mainnet
5. **راه‌اندازی Monitoring** و Dashboard

---

**موفق باشید! 🚀**
