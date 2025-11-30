# 🌐 اطلاعات شبکه‌های Arbitrum

## Arbitrum Sepolia (Testnet) ⚡

### اطلاعات شبکه برای MetaMask

```
Network Name: Arbitrum Sepolia
RPC URL: https://sepolia-rollup.arbitrum.io/rpc
Chain ID: 421614
Currency Symbol: ETH
Block Explorer: https://sepolia.arbiscan.io/
```

### Faucets (دریافت توکن رایگان)

**ETH Sepolia:**
```
https://faucet.quicknode.com/arbitrum/sepolia
https://sepoliafaucet.com/
https://www.alchemy.com/faucets/arbitrum-sepolia
```

**LINK Token:**
```
https://faucets.chain.link/arbitrum-sepolia
```

### Chainlink VRF v2 Configuration

```solidity
VRF Coordinator: 0x50d47e4142598E3411aA864e08a44284e471AC6f
Key Hash (Gas Lane): 0x027f94ff1465b3525f9fc03e9ff7d6d2c0953482246dd6ae07570c45d6631414
```

**مدیریت Subscription:**
```
https://vrf.chain.link/arbitrum-sepolia
```

### Block Explorer

```
https://sepolia.arbiscan.io/
```

**ویژگی‌ها:**
- جستجوی تراکنش‌ها
- مشاهده قراردادها
- Verify قراردادها
- دریافت API Key

### Bridge (پل) به Arbitrum Sepolia

**از Ethereum Sepolia:**
```
https://bridge.arbitrum.io/?destinationChain=arbitrum-sepolia&sourceChain=sepolia
```

**مراحل:**
1. دریافت ETH Sepolia از Faucet
2. Connect به Bridge
3. انتقال به Arbitrum Sepolia (5-10 دقیقه)

---

## Arbitrum One (Mainnet) 🌟

### اطلاعات شبکه

```
Network Name: Arbitrum One
RPC URL: https://arb1.arbitrum.io/rpc
Chain ID: 42161
Currency Symbol: ETH
Block Explorer: https://arbiscan.io/
```

### LUSD Token Address (Mainnet)

```
LUSD Token: 0x93b346b6BC2548dA6A1E7d98E9a421B42541425b
```

**اضافه کردن به MetaMask:**
```
Token Symbol: LUSD
Decimals: 18
```

### Chainlink VRF v2 (Mainnet)

```solidity
VRF Coordinator: 0x41034678D6C633D8a95c75e1138A360a28bA15d1
Key Hash: 0x72d2b016bb5b62912afea355ebf33b91319f828738b111b723b78696b9847b63
```

**مدیریت Subscription:**
```
https://vrf.chain.link/arbitrum
```

### Bridge به Arbitrum One

**Official Bridge:**
```
https://bridge.arbitrum.io/
```

**Alternative Bridges:**
- Hop Protocol: https://app.hop.exchange/
- Across: https://across.to/
- Synapse: https://synapseprotocol.com/

**زمان انتقال:**
- L1 → L2: ~10-15 دقیقه
- L2 → L1: ~7 روز (withdrawal period)

---

## دریافت LUSD (Mainnet)

### روش 1: خرید مستقیم

**DEXs:**
```
Uniswap: https://app.uniswap.org/
Curve: https://curve.fi/
```

**Pair:**
```
LUSD/ETH
LUSD/USDC
```

### روش 2: Mint از Liquity

```
https://www.liquity.org/
```

**مراحل:**
1. Deposit ETH به عنوان collateral
2. Mint LUSD (حداقل 2000 LUSD)
3. Bridge به Arbitrum

### روش 3: خرید از CEX

**صرافی‌های پشتیبان:**
- کمیاب - بهتر از DEX استفاده کنید

---

## Gas و هزینه‌ها

### Arbitrum Sepolia (Testnet)

```
Gas Price: ~0.1 Gwei
Average Transaction: ~0.0001 ETH
Deploy Contract: ~0.005 ETH
```

💡 **نکته:** همیشه تست کامل در Sepolia قبل از Mainnet!

### Arbitrum One (Mainnet)

```
Gas Price: 0.01-0.1 Gwei
Average Transaction: $0.10-$0.50
Deploy Contract: $5-$20
Complex Transaction: $1-$5
```

**مقایسه با L1:**
- 10-100x ارزان‌تر از Ethereum Mainnet
- سرعت بیشتر (~2s finality)

---

## RPC Endpoints (گزینه‌های مختلف)

### Arbitrum Sepolia

**Public RPC:**
```
https://sepolia-rollup.arbitrum.io/rpc
wss://sepolia-rollup.arbitrum.io/rpc
```

**Alchemy (توصیه می‌شود):**
```
https://arb-sepolia.g.alchemy.com/v2/YOUR-API-KEY
```

**Infura:**
```
https://arbitrum-sepolia.infura.io/v3/YOUR-API-KEY
```

**QuickNode:**
```
https://YOUR-ENDPOINT.arbitrum-sepolia.quiknode.pro/YOUR-API-KEY/
```

### Arbitrum One

**Public RPC:**
```
https://arb1.arbitrum.io/rpc
wss://arb1.arbitrum.io/rpc
```

**Alchemy:**
```
https://arb-mainnet.g.alchemy.com/v2/YOUR-API-KEY
```

**Infura:**
```
https://arbitrum-mainnet.infura.io/v3/YOUR-API-KEY
```

---

## API Keys

### Arbiscan API Key

**دریافت:**
```
https://arbiscan.io/myapikey
```

**استفاده:**
- Verify قراردادها
- خواندن داده‌های on-chain
- Track تراکنش‌ها

### Alchemy API Key

**دریافت:**
```
https://www.alchemy.com/
```

**Free Tier:**
- 300M Compute Units/month
- کافی برای Development

### Infura API Key

**دریافت:**
```
https://infura.io/
```

**Free Tier:**
- 100,000 requests/day
- مناسب برای Testing

---

## Smart Contract Addresses (Arbitrum Sepolia)

### System Contracts

```
WETH: 0x980B62Da83eFf3D4576C647993b0c1D7faf17c73
Multicall3: 0xcA11bde05977b3631167028862bE2a173976CA11
```

### Test Tokens

```
Mock USDC: دیپلوی خودتان
Mock LUSD: دیپلوی خودتان (از src/mocks/MockLUSD.sol)
```

---

## مانیتورینگ و آنالیز

### Block Explorers

**Arbiscan:**
```
Testnet: https://sepolia.arbiscan.io/
Mainnet: https://arbiscan.io/
```

**The Graph:**
```
https://thegraph.com/explorer
```

### Analytics

**DeFi Llama:**
```
https://defillama.com/chain/Arbitrum
```

**Dune Analytics:**
```
https://dune.com/arbitrum
```

---

## دستورات سریع Cast

### چک کردن Balance

```powershell
# ETH Balance
cast balance YOUR_ADDRESS --rpc-url $RPC

# LUSD Balance
cast call $LUSD "balanceOf(address)" YOUR_ADDRESS --rpc-url $RPC

# نمایش با decimals
cast --to-unit 18 $(cast call $LUSD "balanceOf(address)" YOUR_ADDRESS --rpc-url $RPC)
```

### ارسال توکن

```powershell
# Transfer ETH
cast send TO_ADDRESS --value 0.1ether --rpc-url $RPC --private-key $PK

# Transfer LUSD
cast send $LUSD "transfer(address,uint256)" TO_ADDRESS 100e18 --rpc-url $RPC --private-key $PK
```

### چک کردن قرارداد

```powershell
# Owner
cast call $CONTRACT "owner()" --rpc-url $RPC

# Paused
cast call $CONTRACT "paused()" --rpc-url $RPC

# Current Game ID
cast call $CONTRACT "currentGameId()" --rpc-url $RPC
```

---

## نکات امنیتی

### Private Key

⚠️ **هرگز Private Key واقعی را استفاده نکنید در Testnet!**

**ایجاد کیف پول تست:**
```powershell
cast wallet new
```

### Environment Variables

```powershell
# ذخیره در .env (هرگز commit نکنید!)
echo "PRIVATE_KEY=your_key" >> .env
echo ".env" >> .gitignore
```

### Multisig (Production)

**Gnosis Safe:**
```
https://app.safe.global/
```

**توصیه:**
- حداقل 3/5 Multisig برای Owner
- جدا کردن Operator از Owner
- Emergency procedures مستند

---

## Troubleshooting

### خطای "chain not supported"

```powershell
# اضافه کردن شبکه به foundry.toml
[rpc_endpoints]
arbitrum_sepolia = "https://sepolia-rollup.arbitrum.io/rpc"
```

### خطای "nonce too high"

```powershell
# Reset در MetaMask:
# Settings → Advanced → Reset Account
```

### خطای "insufficient funds"

```
دریافت ETH از Faucet
https://faucet.quicknode.com/arbitrum/sepolia
```

---

## مراجع

**Documentation:**
- Arbitrum: https://docs.arbitrum.io/
- Chainlink: https://docs.chain.link/
- Foundry: https://book.getfoundry.sh/

**Community:**
- Discord: https://discord.gg/arbitrum
- Twitter: @arbitrum
- Forum: https://forum.arbitrum.foundation/

---

**به‌روزرسانی:** نوامبر 2024

**نکته:** همیشه اطلاعات شبکه را از منابع رسمی تأیید کنید!
