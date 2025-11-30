# 📂 فهرست کامل پروژه Participation Game

## 🎯 راهنماهای شروع سریع

### برای مبتدی‌ها
1. **QUICKSTART.md** - شروع 5 دقیقه‌ای (ساده‌ترین)
2. **README_FA.md** - راهنمای کامل فارسی
3. **SETUP_GUIDE_WINDOWS.md** - راهنمای مفصل Windows 10

### برای توسعه‌دهندگان
1. **README.md** - مستندات کامل انگلیسی
2. **IMPLEMENTATION_CHECKLIST.md** - بررسی پیاده‌سازی
3. **TESTING_GUIDE.md** - راهنمای تست جامع
4. **NETWORK_CONFIG.md** - اطلاعات شبکه‌های Arbitrum

---

## 📁 ساختار کامل فایل‌ها

```
Participation Game/
│
├── 📄 قراردادهای اصلی (src/)
│   ├── ParticipationGame.sol           # قرارداد اصلی (632 خط)
│   └── mocks/
│       └── MockLUSD.sol                 # LUSD تست
│
├── 🧪 تست‌ها (test/)
│   ├── ParticipationGame.t.sol         # 40+ test case
│   └── helpers/
│       └── ParticipationGameTestHelper.sol  # Helper برای VRF test
│
├── 🚀 اسکریپت‌های دیپلوی (script/)
│   └── Deploy.s.sol                     # Forge script
│
├── ⚙️ کانفیگ و تنظیمات
│   ├── foundry.toml                    # Foundry config
│   ├── remappings.txt                  # Import mappings
│   ├── .env.example                    # نمونه environment variables
│   └── .gitignore                      # Git ignore
│
├── 📖 راهنماهای فارسی
│   ├── README_FA.md                    # راهنمای اصلی فارسی
│   ├── QUICKSTART.md                   # شروع سریع
│   ├── SETUP_GUIDE_WINDOWS.md          # راهنمای کامل Windows
│   ├── TESTING_GUIDE.md                # راهنمای تست
│   ├── NETWORK_CONFIG.md               # اطلاعات شبکه
│   └── PROJECT_INDEX.md                # این فایل
│
├── 📖 راهنماهای انگلیسی
│   ├── README.md                       # Main documentation
│   └── IMPLEMENTATION_CHECKLIST.md     # چک‌لیست پیاده‌سازی
│
├── 🛠️ اسکریپت‌های کمکی (PowerShell)
│   ├── setup.ps1                       # نصب خودکار
│   └── deploy-manual.ps1               # دیپلوی دستی
│
└── 📦 Dependencies (lib/) - بعد از forge install
    ├── openzeppelin-contracts-upgradeable/
    ├── openzeppelin-contracts/
    ├── chainlink/
    └── forge-std/
```

---

## 📚 راهنمای استفاده از هر فایل

### 1. قراردادهای هوشمند

#### `src/ParticipationGame.sol` ⭐
**توضیح:** قرارداد اصلی بازی

**محتوا:**
- ✅ UUPS Upgradeable Pattern
- ✅ Chainlink VRF v2 Integration
- ✅ Game Lifecycle Management
- ✅ Voting System
- ✅ Prize Distribution
- ✅ Admin Functions

**خطوط کد:** 632
**امنیت:** ReentrancyGuard, Pausable, Access Control

---

#### `src/mocks/MockLUSD.sol`
**توضیح:** توکن LUSD ساختگی برای تست

**استفاده:**
```powershell
# دیپلوی
forge create src/mocks/MockLUSD.sol:MockLUSD --rpc-url $RPC --private-key $PK

# Mint (Faucet)
cast send $LUSD "faucet(uint256)" 10000e18 --rpc-url $RPC --private-key $PK
```

---

### 2. تست‌ها

#### `test/ParticipationGame.t.sol` ⭐
**توضیح:** تست‌های جامع قرارداد

**Coverage:**
- ✅ Initialization (3 tests)
- ✅ Share Purchasing (8 tests)
- ✅ Rollover Logic (2 tests)
- ✅ VRF & Elimination (4 tests)
- ✅ Voting System (5 tests)
- ✅ Prize Distribution (3 tests)
- ✅ Admin Functions (6 tests)
- ✅ Edge Cases (3 tests)

**اجرا:**
```powershell
forge test -vvv
forge test --match-test test_BuyShares -vvvv
forge coverage
```

---

### 3. اسکریپت‌های دیپلوی

#### `script/Deploy.s.sol`
**توضیح:** Forge script برای دیپلوی خودکار

**استفاده:**
```powershell
forge script script/Deploy.s.sol:DeployParticipationGame \
  --rpc-url $ARBITRUM_SEPOLIA_RPC_URL \
  --broadcast \
  --verify
```

---

#### `deploy-manual.ps1` (PowerShell)
**توضیح:** دیپلوی دستی گام به گام

**استفاده:**
```powershell
.\deploy-manual.ps1
.\deploy-manual.ps1 -SkipMockLUSD  # اگر LUSD از قبل دارید
```

**خروجی:**
- آدرس Mock LUSD
- آدرس Implementation
- آدرس Proxy
- دستورات بعدی

---

### 4. راهنماها

#### `QUICKSTART.md` 🚀 (شروع از اینجا!)
**برای چه کسی:** تازه‌واردها

**محتوا:**
1. نصب 5 دقیقه‌ای
2. دیپلوی سریع
3. تست ساده
4. عیب‌یابی رایج

**زمان مطالعه:** 5 دقیقه
**زمان اجرا:** 15 دقیقه

---

#### `README_FA.md` 📖
**برای چه کسی:** همه

**محتوا:**
- خلاصه پروژه
- نصب و راه‌اندازی
- توابع اصلی
- مثال‌های کد
- عیب‌یابی

**زمان مطالعه:** 15 دقیقه

---

#### `SETUP_GUIDE_WINDOWS.md` 🪟
**برای چه کسی:** کاربران Windows

**محتوا:**
1. نصب پیش‌نیازها
2. Foundry روی Windows
3. دریافت توکن تست
4. راه‌اندازی VRF
5. کانفیگ .env
6. دیپلوی قرارداد
7. تست Testnet
8. عیب‌یابی کامل

**زمان مطالعه:** 30 دقیقه
**مناسب برای:** راه‌اندازی کامل production-ready

---

#### `TESTING_GUIDE.md` 🧪
**برای چه کسی:** توسعه‌دهندگان

**محتوا:**
1. تست Local (Foundry)
2. تست Testnet (گام به گام)
3. تست با Remix
4. Checklist کامل
5. مثال یک cycle کامل

**زمان مطالعه:** 20 دقیقه
**مناسب برای:** Quality Assurance

---

#### `NETWORK_CONFIG.md` 🌐
**برای چه کسی:** Ops/DevOps

**محتوا:**
- اطلاعات شبکه Arbitrum
- Faucets
- VRF Configuration
- Bridge
- RPC Endpoints
- API Keys
- دستورات Cast

**زمان مطالعه:** 10 دقیقه
**مناسب برای:** مرجع سریع

---

#### `IMPLEMENTATION_CHECKLIST.md` ✅
**برای چه کسی:** Auditors/Reviewers

**محتوا:**
- مقایسه با پرامپت اولیه
- بررسی امنیت
- بررسی الگوها
- Coverage تست‌ها
- آمادگی Production

**زمان مطالعه:** 20 دقیقه
**مناسب برای:** Code Review

---

### 5. اسکریپت‌های کمکی

#### `setup.ps1` 🛠️
**توضیح:** نصب خودکار dependencies

**اجرا:**
```powershell
.\setup.ps1
```

**عملیات:**
1. چک Git
2. نصب Foundry
3. نصب Dependencies
4. Build
5. Test

**زمان:** 5-10 دقیقه

---

### 6. کانفیگ‌ها

#### `foundry.toml`
**توضیح:** پیکربندی Foundry

**تنظیمات مهم:**
- Solidity version: 0.8.20
- Optimizer: 200 runs
- RPC endpoints
- Etherscan API

---

#### `.env.example`
**توضیح:** نمونه environment variables

**استفاده:**
```powershell
cp .env.example .env
notepad .env
```

**متغیرهای ضروری:**
- PRIVATE_KEY
- VRF_SUBSCRIPTION_ID
- PLATFORM_FEE_WALLET
- RPC URLs

---

## 🎯 مسیرهای یادگیری

### مسیر 1: مبتدی (30 دقیقه)
1. ✅ `QUICKSTART.md` - خواندن
2. ✅ `.\setup.ps1` - اجرا
3. ✅ `forge test` - تست local
4. ✅ `README_FA.md` - آشنایی با پروژه

### مسیر 2: توسعه‌دهنده (2 ساعت)
1. ✅ `README.md` - مطالعه کامل
2. ✅ `SETUP_GUIDE_WINDOWS.md` - پیاده‌سازی
3. ✅ دیپلوی روی Testnet
4. ✅ `TESTING_GUIDE.md` - تست کامل
5. ✅ `ParticipationGame.sol` - بررسی کد

### مسیر 3: Auditor/Reviewer (3 ساعت)
1. ✅ `IMPLEMENTATION_CHECKLIST.md`
2. ✅ بررسی کد `ParticipationGame.sol`
3. ✅ بررسی تست‌ها
4. ✅ اجرای تست‌ها
5. ✅ بررسی امنیت
6. ✅ تست روی Testnet

---

## 📊 آمار پروژه

### کد
- **قرارداد اصلی:** 632 خط
- **تست‌ها:** 500+ خط
- **Documentation:** 3000+ خط
- **Scripts:** 400+ خط

### تست‌ها
- **تعداد:** 40+ test cases
- **Coverage هدف:** >95%
- **Edge Cases:** 10+

### امنیت
- **Patterns:** 6 (ReentrancyGuard, Pausable, etc.)
- **Access Control:** 2 سطح (Owner, Operator)
- **Upgradeable:** UUPS ✅

---

## 🔍 جستجوی سریع

**نصب و راه‌اندازی:**
- Windows: `SETUP_GUIDE_WINDOWS.md`
- سریع: `QUICKSTART.md`
- کامل: `README_FA.md`

**تست:**
- Local: `forge test`
- Testnet: `TESTING_GUIDE.md`

**دیپلوی:**
- خودکار: `script/Deploy.s.sol`
- دستی: `deploy-manual.ps1`

**مرجع:**
- شبکه: `NETWORK_CONFIG.md`
- توابع: `README.md` → API Reference
- بررسی: `IMPLEMENTATION_CHECKLIST.md`

**عیب‌یابی:**
- `SETUP_GUIDE_WINDOWS.md` → Troubleshooting
- `TESTING_GUIDE.md` → Common Issues

---

## ✅ چک‌لیست شروع

### برای اولین بار
- [ ] خواندن `QUICKSTART.md`
- [ ] اجرای `.\setup.ps1`
- [ ] اجرای `forge test`
- [ ] خواندن `README_FA.md`

### برای دیپلوی Testnet
- [ ] خواندن `SETUP_GUIDE_WINDOWS.md`
- [ ] دریافت ETH و LINK
- [ ] راه‌اندازی VRF
- [ ] کانفیگ `.env`
- [ ] اجرای `.\deploy-manual.ps1`
- [ ] تست با `TESTING_GUIDE.md`

### برای Production
- [ ] بررسی `IMPLEMENTATION_CHECKLIST.md`
- [ ] Security Audit
- [ ] Coverage >95%
- [ ] تست کامل Testnet
- [ ] دیپلوی Mainnet
- [ ] Monitoring

---

## 🆘 کمک و پشتیبانی

### مشکل دارید؟
1. عیب‌یابی در `SETUP_GUIDE_WINDOWS.md`
2. FAQ در `TESTING_GUIDE.md`
3. مثال‌ها در `README_FA.md`

### سوال دارید؟
- مستندات را بخوانید
- کد مثال‌ها را ببینید
- تست‌ها را چک کنید

---

## 📅 به‌روزرسانی

**آخرین به‌روزرسانی:** نوامبر 2024

**نسخه پروژه:** 1.0.0

**نسخه Solidity:** 0.8.20

---

**موفق باشید! 🚀**

این پروژه با دقت و توجه به جزئیات ساخته شده است.
