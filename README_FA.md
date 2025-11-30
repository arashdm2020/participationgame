# 🎮 قرارداد هوشمند Participation Game

قرارداد لاتاری غیرمتمرکز و trustless روی **Arbitrum Layer 2** با استفاده از توکن **LUSD**

---

## 📌 خلاصه پروژه

### مدل مالی
- 💰 **10%** کارمزد پلتفرم (انتقال فوری)
- 🏆 **90%** جایزه (Prize Pool)
  - **85%** برنده نهایی
  - **5%** جوایز تسلی

### ویژگی‌های کلیدی
- ✅ UUPS Upgradeable (قابلیت ارتقا)
- ✅ امنیت بالا (OpenZeppelin)
- ✅ تصادفی‌سازی عادلانه (Chainlink VRF)
- ✅ سیستم رأی‌گیری (8→4→2)
- ✅ Rollover خودکار به بازی بعدی
- ✅ Cap پویا (±20%)

---

## 🚀 شروع سریع (5 دقیقه!)

### نصب خودکار

```powershell
# در PowerShell اجرا کنید:
.\setup.ps1
```

### نصب دستی

```powershell
# 1. نصب Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# 2. نصب Dependencies
forge install OpenZeppelin/openzeppelin-contracts-upgradeable --no-commit
forge install OpenZeppelin/openzeppelin-contracts --no-commit
forge install smartcontractkit/chainlink --no-commit
forge install foundry-rs/forge-std --no-commit

# 3. Build
forge build

# 4. Test
forge test
```

---

## 📋 نیازمندی‌های Windows 10

### نرم‌افزار
1. **Git** - https://git-scm.com/download/win
2. **Foundry** - نصب با دستورات بالا
3. **MetaMask** - https://metamask.io/

### توکن‌های تست (رایگان)
1. **ETH Arbitrum Sepolia** - https://faucet.quicknode.com/arbitrum/sepolia
2. **LINK** - https://faucets.chain.link/arbitrum-sepolia
3. **Mock LUSD** - خودمان دیپلوی می‌کنیم

---

## 🌐 راه‌اندازی Testnet

### مرحله 1: Chainlink VRF

1. رفتن به: https://vrf.chain.link/arbitrum-sepolia
2. Connect Wallet
3. Create Subscription
4. Add 2 LINK
5. کپی Subscription ID

### مرحله 2: کانفیگ .env

```bash
cp .env.example .env
notepad .env
```

پر کردن مقادیر:
```bash
PRIVATE_KEY=your_private_key_here
VRF_SUBSCRIPTION_ID=123
PLATFORM_FEE_WALLET=0x...
```

### مرحله 3: دیپلوی

```powershell
# اجرای اسکریپت دیپلوی
.\deploy-manual.ps1
```

یا استفاده از Forge Script:
```powershell
forge script script/Deploy.s.sol:DeployParticipationGame \
  --rpc-url $env:ARBITRUM_SEPOLIA_RPC_URL \
  --broadcast \
  --verify
```

### مرحله 4: اضافه کردن Consumer

1. رفتن به VRF Subscription
2. Add Consumer
3. آدرس Proxy را وارد کنید

---

## 🧪 تست

### Local Testing

```powershell
# همه تست‌ها
forge test -vvv

# تست خاص
forge test --match-test test_BuyShares -vvvv

# Coverage
forge coverage
```

### Testnet Testing

```powershell
# دریافت Mock LUSD
cast send $LUSD "faucet(uint256)" 10000000000000000000000 \
  --rpc-url $RPC --private-key $PK

# Approve
cast send $LUSD "approve(address,uint256)" $PROXY MAX \
  --rpc-url $RPC --private-key $PK

# خرید Share
cast send $PROXY "buyShares(uint256,address)" 100000000000000000000 0x0 \
  --rpc-url $RPC --private-key $PK
```

---

## 📁 ساختار پروژه

```
📦 Participation Game
├── 📄 src/
│   ├── ParticipationGame.sol      # قرارداد اصلی
│   └── mocks/
│       └── MockLUSD.sol            # LUSD تست
├── 📄 test/
│   ├── ParticipationGame.t.sol    # تست‌ها
│   └── helpers/
│       └── ParticipationGameTestHelper.sol
├── 📄 script/
│   └── Deploy.s.sol                # اسکریپت دیپلوی
├── 📄 foundry.toml                 # کانفیگ Foundry
├── 📄 .env.example                 # نمونه environment
├── 📄 setup.ps1                    # نصب خودکار
├── 📄 deploy-manual.ps1            # دیپلوی دستی
└── 📄 README_FA.md                 # این فایل
```

---

## 🔧 توابع اصلی

### کاربران

| تابع | توضیح |
|------|-------|
| `buyShares(amount, prizeAddress)` | خرید share |
| `submitVote(gameId, decision)` | رأی دادن |

### Operator

| تابع | توضیح |
|------|-------|
| `requestRandomWords(gameId)` | درخواست VRF |
| `processVotingResults(gameId)` | پردازش رأی‌ها |
| `distributeFinalPrize(gameId)` | توزیع جایزه نهایی |
| `distributeConsolationPrizes(...)` | توزیع جوایز تسلی |

### Admin (Owner)

| تابع | توضیح |
|------|-------|
| `setOperator(address, bool)` | تنظیم operator |
| `pauseGame()` | توقف قرارداد |
| `unpauseGame()` | راه‌اندازی مجدد |
| `setPlatformFeeWallet(address)` | تغییر کیف پول کارمزد |
| `emergencyLUSDWithdrawal(to, amount)` | برداشت اضطراری |

---

## 🎯 چرخه یک بازی

```
1. Buying (خرید share)
   ↓
2. CapReached (رسیدن به سقف)
   ↓
3. VRF_Request (درخواست تصادفی)
   ↓
4. Eliminating (حذف به 8 نفر)
   ↓
5. Voting8 (رأی‌گیری 8 نفر)
   ↓
6. Voting4 (رأی‌گیری 4 نفر)
   ↓
7. Voting2 (رأی‌گیری 2 نفر)
   ↓
8. Finished (توزیع جوایز)
```

---

## 💡 مثال کامل

```powershell
# 1. Mint LUSD
cast send $LUSD "faucet(uint256)" 10000e18 --rpc-url $RPC --private-key $PK

# 2. Approve
cast send $LUSD "approve(address,uint256)" $PROXY MAX --rpc-url $RPC --private-key $PK

# 3. خرید 100 LUSD
cast send $PROXY "buyShares(uint256,address)" 100e18 0x0 --rpc-url $RPC --private-key $PK

# 4. چک کردن اطلاعات
cast call $PROXY "getGameDetails(uint256)" 1 --rpc-url $RPC
cast call $PROXY "getParticipant(uint256,address)" 1 $MY_ADDRESS --rpc-url $RPC

# 5. رسیدن به cap (10,000 LUSD)
# ... خرید توسط کاربران دیگر ...

# 6. درخواست VRF (operator)
cast send $PROXY "requestRandomWords(uint256)" 1 --rpc-url $RPC --private-key $PK

# 7. صبر 2-5 دقیقه برای VRF

# 8. رأی دادن
cast send $PROXY "submitVote(uint256,bool)" 1 true --rpc-url $RPC --private-key $PK

# 9. پردازش رأی‌ها (بعد از 24 ساعت)
cast send $PROXY "processVotingResults(uint256)" 1 --rpc-url $RPC --private-key $PK

# 10. توزیع جایزه نهایی
cast send $PROXY "distributeFinalPrize(uint256)" 1 --rpc-url $RPC --private-key $PK
```

---

## 🔐 امنیت

### الگوهای امنیتی پیاده‌سازی شده

- ✅ **ReentrancyGuard** - جلوگیری از حملات reentrancy
- ✅ **Pausable** - قابلیت توقف اضطراری
- ✅ **Access Control** - محدودیت دسترسی (Owner/Operator)
- ✅ **Checks-Effects-Interactions** - الگوی امن انتقال توکن
- ✅ **SafeERC20** - انتقال امن توکن
- ✅ **UUPS Upgradeable** - قابلیت ارتقا با کنترل امنیت

### نکات امنیتی

⚠️ **هشدار:** این قرارداد فقط برای تست روی Sepolia است
- Private Key واقعی خود را استفاده نکنید
- قبل از دیپلوی Mainnet حتماً Audit کنید
- VRF Subscription را شارژ نگه دارید
- Owner را با Multisig امن کنید

---

## 📚 مستندات

### راهنماها

- 📖 **QUICKSTART.md** - شروع سریع
- 📖 **SETUP_GUIDE_WINDOWS.md** - راهنمای کامل Windows
- 📖 **TESTING_GUIDE.md** - راهنمای تست
- 📖 **IMPLEMENTATION_CHECKLIST.md** - بررسی پیاده‌سازی
- 📖 **README.md** - مستندات انگلیسی

### لینک‌های مفید

- 🌐 Arbitrum Docs: https://docs.arbitrum.io/
- 🌐 Chainlink VRF: https://docs.chain.link/vrf/v2/introduction
- 🌐 OpenZeppelin: https://docs.openzeppelin.com/contracts/
- 🌐 Foundry Book: https://book.getfoundry.sh/

### Explorers

- 🔍 Arbitrum Sepolia: https://sepolia.arbiscan.io/
- 🔍 Chainlink VRF: https://vrf.chain.link/arbitrum-sepolia

---

## 🛠️ عیب‌یابی

### مشکلات رایج

**"forge: command not found"**
```powershell
# باز کردن مجدد PowerShell یا اضافه کردن به PATH
```

**"insufficient funds"**
```
دریافت ETH از Faucet
```

**"VRF not funded"**
```
شارژ Subscription با LINK
```

**"transaction underpriced"**
```powershell
# اضافه کردن gas price
--gas-price 1000000000
```

برای راهنمای کامل عیب‌یابی: `SETUP_GUIDE_WINDOWS.md`

---

## ✅ Checklist قبل از Production

- [ ] تمام تست‌ها Pass شده
- [ ] Coverage > 95%
- [ ] Security Audit انجام شده
- [ ] VRF Subscription شارژ شده
- [ ] Owner به Multisig منتقل شده
- [ ] Monitoring راه‌اندازی شده
- [ ] Emergency procedures مستند شده
- [ ] Team آموزش دیده

---

## 🎯 مراحل بعدی

1. ✅ **تست کامل** روی Sepolia
2. 🔒 **Security Audit** حرفه‌ای
3. 🚀 **Deploy** روی Arbitrum Mainnet
4. 📊 **Monitoring** و Dashboard
5. 📱 **Frontend** و UI/UX

---

## 🤝 مشارکت

این پروژه open-source است. برای مشارکت:
1. Fork کنید
2. تغییرات خود را اعمال کنید
3. Pull Request ارسال کنید

---

## 📄 License

MIT License

---

## 💬 پشتیبانی

سوالات و مشکلات را در Issues قرار دهید.

---

**موفق باشید! 🚀**

این قرارداد با دقت و توجه به امنیت نوشته شده، اما همیشه قبل از استفاده در production آن را Audit کنید.
