# 🧪 راهنمای تست قرارداد

## 📋 فهرست تست‌ها

### 1️⃣ تست Local (Foundry)
### 2️⃣ تست Testnet (Arbitrum Sepolia)
### 3️⃣ تست UI (Remix/Frontend)

---

## 1️⃣ تست Local با Foundry

### اجرای همه تست‌ها

```powershell
# تست ساده
forge test

# با جزئیات بیشتر
forge test -vvv

# با trace کامل
forge test -vvvv
```

### اجرای تست‌های خاص

```powershell
# فقط تست‌های خرید
forge test --match-test test_BuyShares -vvv

# فقط تست‌های VRF
forge test --match-test VRF -vvv

# فقط تست‌های voting
forge test --match-test Vote -vvv
```

### Coverage Report

```powershell
# تولید گزارش coverage
forge coverage

# خروجی به فایل
forge coverage > coverage.txt

# Coverage با جزئیات
forge coverage --report lcov
```

**هدف:** >95% coverage

---

## 2️⃣ تست Testnet (گام به گام)

### پیش‌نیازها

```powershell
# Set environment variables
$RPC_URL = "https://sepolia-rollup.arbitrum.io/rpc"
$PRIVATE_KEY = "your_private_key"
$PROXY = "0x_your_proxy_address"
$LUSD = "0x_your_mock_lusd_address"
```

---

### تست 1: بررسی دیپلوی

```powershell
# چک کردن owner
cast call $PROXY "owner()" --rpc-url $RPC_URL

# چک کردن LUSD token
cast call $PROXY "lusdToken()" --rpc-url $RPC_URL

# چک کردن platform fee wallet
cast call $PROXY "platformFeeWallet()" --rpc-url $RPC_URL

# چک کردن current game ID
cast call $PROXY "currentGameId()" --rpc-url $RPC_URL
```

**✅ انتظار:** همه مقادیر صحیح برگردانده شوند

---

### تست 2: Mint و Approve LUSD

```powershell
# Mint 10,000 LUSD
cast send $LUSD "faucet(uint256)" 10000000000000000000000 \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

# چک balance
cast call $LUSD "balanceOf(address)" YOUR_WALLET --rpc-url $RPC_URL

# Approve برای قرارداد
cast send $LUSD "approve(address,uint256)" $PROXY 1000000000000000000000000 \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

# چک allowance
cast call $LUSD "allowance(address,address)" YOUR_WALLET $PROXY --rpc-url $RPC_URL
```

**✅ انتظار:** 
- Balance: 10,000 LUSD
- Allowance: تقریباً بی‌نهایت

---

### تست 3: خرید Share اول

```powershell
# خرید 100 LUSD
cast send $PROXY "buyShares(uint256,address)" \
  100000000000000000000 \
  0x0000000000000000000000000000000000000000 \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

# چک participant
cast call $PROXY "getParticipant(uint256,address)" 1 YOUR_WALLET --rpc-url $RPC_URL

# چک game details
cast call $PROXY "getGameDetails(uint256)" 1 --rpc-url $RPC_URL

# چک participant count
cast call $PROXY "getParticipantCount(uint256)" 1 --rpc-url $RPC_URL
```

**✅ انتظار:**
- Shares: 100 LUSD
- Game revenue: 100 LUSD
- Prize pool: 90 LUSD (90%)
- Platform fee: 10 LUSD (10%)
- Participant count: 1

---

### تست 4: Rollover به بازی بعدی

```powershell
# خرید بیش از cap (فرض: cap = 10,000 LUSD)
# خرید 11,000 LUSD
cast send $PROXY "buyShares(uint256,address)" \
  11000000000000000000000 \
  0x0000000000000000000000000000000000000000 \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

# چک current game ID (باید 2 باشد)
cast call $PROXY "currentGameId()" --rpc-url $RPC_URL

# چک game 1 status (باید CapReached باشد)
cast call $PROXY "getGameDetails(uint256)" 1 --rpc-url $RPC_URL

# چک game 2 revenue (باید 1,000 LUSD باشد)
cast call $PROXY "getGameDetails(uint256)" 2 --rpc-url $RPC_URL
```

**✅ انتظار:**
- Game 1: Status = 1 (CapReached), Revenue = 10,000
- Game 2: Status = 0 (Buying), Revenue = 1,000
- Current Game ID = 2

---

### تست 5: VRF و Elimination

```powershell
# درخواست VRF (به عنوان operator)
cast send $PROXY "requestRandomWords(uint256)" 1 \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

# چک status (باید VRF_Request باشد)
cast call $PROXY "getGameDetails(uint256)" 1 --rpc-url $RPC_URL
```

**⏳ صبر کنید:** 2-5 دقیقه تا VRF fulfill شود

```powershell
# چک status مجدد (باید Voting8 باشد)
cast call $PROXY "getGameDetails(uint256)" 1 --rpc-url $RPC_URL

# چک active participants
cast call $PROXY "getActiveParticipants(uint256)" 1 --rpc-url $RPC_URL
```

**✅ انتظار:**
- Status = 4 (Voting8)
- Active participants: 8 نفر (یا کمتر اگر شرکت‌کننده کم بود)

---

### تست 6: Voting

```powershell
# Submit vote (true = continue, false = end)
cast send $PROXY "submitVote(uint256,bool)" 1 true \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

# چک vote tallies
cast call $PROXY "getVoteTallies(uint256)" 1 --rpc-url $RPC_URL

# چک participant voting status
cast call $PROXY "getParticipant(uint256,address)" 1 YOUR_WALLET --rpc-url $RPC_URL
```

**✅ انتظار:**
- Continue votes: 1
- hasVotedInCurrentStage: true

---

### تست 7: Process Voting

```powershell
# Wait for voting deadline (24 hours or fast-forward in test)
# برای testnet: 24 ساعت صبر کنید

# Process voting results (به عنوان operator)
cast send $PROXY "processVotingResults(uint256)" 1 \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

# چک new status
cast call $PROXY "getGameDetails(uint256)" 1 --rpc-url $RPC_URL
```

**✅ انتظار:**
- اگر continue بیشتر بود: Status = Voting4
- اگر end بیشتر بود: Status = Finished

---

### تست 8: Prize Distribution

```powershell
# Distribute final prize (وقتی بازی Finished شد)
cast send $PROXY "distributeFinalPrize(uint256)" 1 \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

# چک winner balance
cast call $LUSD "balanceOf(address)" WINNER_ADDRESS --rpc-url $RPC_URL

# چک distribution flag
cast call $PROXY "finalPrizeDistributed(uint256)" 1 --rpc-url $RPC_URL
```

**✅ انتظار:**
- Winner balance: افزایش یافته (85% از prize pool)
- finalPrizeDistributed: true

---

### تست 9: Admin Functions

```powershell
# Set operator
cast send $PROXY "setOperator(address,bool)" OPERATOR_ADDRESS true \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

# Pause game
cast send $PROXY "pauseGame()" \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

# Try to buy shares (باید fail کند)
cast send $PROXY "buyShares(uint256,address)" 100000000000000000000 0x0 \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

# Unpause
cast send $PROXY "unpauseGame()" \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY
```

**✅ انتظار:**
- Operator set successfully
- Pause works (buyShares fails)
- Unpause works (buyShares succeeds)

---

### تست 10: Emergency Withdrawal

```powershell
# Send extra LUSD to contract (not part of prize pool)
cast send $LUSD "transfer(address,uint256)" $PROXY 1000000000000000000000 \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

# Emergency withdrawal (فقط non-prize funds)
cast send $PROXY "emergencyLUSDWithdrawal(address,uint256)" YOUR_WALLET 1000000000000000000000 \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY
```

**✅ انتظار:**
- Withdrawal successful
- Cannot withdraw prize funds

---

## 3️⃣ تست با Remix

### 1. باز کردن Remix
```
https://remix.ethereum.org/
```

### 2. کانفیگ Environment
- Environment: Injected Provider - MetaMask
- Network: Arbitrum Sepolia
- Account: کیف پول شما

### 3. Load Contract
```solidity
// At Address بزنید و آدرس Proxy را وارد کنید
```

### 4. تست توابع
- `buyShares()` - خرید share
- `getGameDetails()` - اطلاعات بازی
- `submitVote()` - رأی دادن
- و غیره...

---

## 📊 Checklist تست کامل

### Basic Functions
- [ ] Initialize contract
- [ ] Buy shares
- [ ] Check participant data
- [ ] Check game details

### Rollover
- [ ] Buy shares exceeding cap
- [ ] Check new game created
- [ ] Check rollover amount correct

### VRF & Elimination
- [ ] Request random words
- [ ] Wait for VRF fulfill
- [ ] Check elimination to 8 participants
- [ ] Check random seed stored

### Voting
- [ ] Submit vote
- [ ] Check vote tallies
- [ ] Check double-vote prevention
- [ ] Process voting results
- [ ] Check status transition

### Prize Distribution
- [ ] Distribute consolation prizes
- [ ] Distribute final prize
- [ ] Check balances updated
- [ ] Check distribution flags

### Admin
- [ ] Set operator
- [ ] Pause/Unpause
- [ ] Set platform fee wallet
- [ ] Update VRF config
- [ ] Emergency withdrawal

### Security
- [ ] Reentrancy protection (all functions)
- [ ] Access control (onlyOwner/onlyOperator)
- [ ] Pausability
- [ ] Cannot withdraw prize funds

### Edge Cases
- [ ] Single participant game
- [ ] Exact cap purchase
- [ ] Zero amount purchase (should fail)
- [ ] Vote after deadline (should fail)
- [ ] Double vote (should fail)

---

## 🎯 مثال کامل یک Cycle

```powershell
# 1. Setup
$RPC="https://sepolia-rollup.arbitrum.io/rpc"
$PK="your_private_key"
$PROXY="your_proxy_address"
$LUSD="your_lusd_address"

# 2. Mint & Approve
cast send $LUSD "faucet(uint256)" 50000000000000000000000 --rpc-url $RPC --private-key $PK
cast send $LUSD "approve(address,uint256)" $PROXY 1000000000000000000000000 --rpc-url $RPC --private-key $PK

# 3. Multiple users buy shares (simulate با چند کیف پول)
# User 1: 2000 LUSD
# User 2: 3000 LUSD
# ...
# User 10: 1000 LUSD

# 4. Reach cap
cast send $PROXY "buyShares(uint256,address)" 10000000000000000000000 0x0 --rpc-url $RPC --private-key $PK

# 5. Request VRF
cast send $PROXY "requestRandomWords(uint256)" 1 --rpc-url $RPC --private-key $PK

# 6. Wait 2-5 minutes for VRF

# 7. Vote (as active participants)
cast send $PROXY "submitVote(uint256,bool)" 1 true --rpc-url $RPC --private-key $PK

# 8. Wait 24 hours

# 9. Process voting
cast send $PROXY "processVotingResults(uint256)" 1 --rpc-url $RPC --private-key $PK

# 10. Repeat voting if continued...

# 11. Distribute prizes
cast send $PROXY "distributeFinalPrize(uint256)" 1 --rpc-url $RPC --private-key $PK
```

---

## 🔍 Monitor در Explorer

```
https://sepolia.arbiscan.io/address/YOUR_PROXY_ADDRESS
```

**چک کنید:**
- ✅ تراکنش‌ها
- ✅ Events emitted
- ✅ Token transfers
- ✅ Internal transactions

---

## ✅ تست موفق!

اگر همه تست‌ها passed شدند، قرارداد شما آماده production است! 🎉

**مرحله بعد:** Security Audit حرفه‌ای
