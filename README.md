# Participation Game Smart Contract

A production-grade, trustless decentralized lottery smart contract built for **Arbitrum L2** using **LUSD** (Liquity USD) as the primary token.

## 🎯 Overview

The Participation Game is a decentralized lottery system with the following key features:

- **Platform:** Arbitrum Layer 2
- **Token:** LUSD (Liquity USD)
- **Financial Model:** 10% Platform Fee / 90% Prize Pool
- **Prize Split:** 85% Final Winner / 5% Consolation Prizes
- **Upgradeable:** UUPS Proxy Pattern

## 🏗️ Architecture

### Core Components

1. **Share Purchasing** - Users buy shares with LUSD
2. **Rollover System** - Excess purchases automatically roll to next game
3. **VRF Elimination** - Chainlink VRF v2 for fair random elimination
4. **Voting Stages** - 8 → 4 → 2 participant voting rounds
5. **Prize Distribution** - Batched consolation + final prize payouts

### Security Features

- OpenZeppelin Upgradeable Contracts
- ReentrancyGuard on all state-changing functions
- Pausable circuit breaker pattern
- Operator role separation
- Checks-Effects-Interactions pattern
- SafeERC20 for token transfers

## 📁 Project Structure

```
├── src/
│   └── ParticipationGame.sol    # Main contract
├── test/
│   └── ParticipationGame.t.sol  # Comprehensive test suite
├── script/
│   └── Deploy.s.sol             # Deployment scripts
├── foundry.toml                 # Foundry configuration
├── remappings.txt               # Import remappings
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Node.js (optional, for additional tooling)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd "Participation Game"

# Install dependencies
forge install OpenZeppelin/openzeppelin-contracts-upgradeable
forge install OpenZeppelin/openzeppelin-contracts
forge install smartcontractkit/chainlink
forge install foundry-rs/forge-std

# Build
forge build
```

### Testing

```bash
# Run all tests
forge test

# Run with verbosity
forge test -vvv

# Run specific test
forge test --match-test test_BuyShares

# Generate coverage report
forge coverage
```

### Deployment

1. Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

2. Configure environment variables:

```env
PRIVATE_KEY=0x...
LUSD_TOKEN_ADDRESS=0x...
PLATFORM_FEE_WALLET=0x...
VRF_SUBSCRIPTION_ID=123
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
ARBISCAN_API_KEY=your_api_key
```

3. Deploy to Arbitrum Sepolia:

```bash
source .env
forge script script/Deploy.s.sol:DeployParticipationGame \
  --rpc-url $ARBITRUM_SEPOLIA_RPC_URL \
  --broadcast \
  --verify
```

## 📋 Contract Functions

### User Functions

| Function | Description |
|----------|-------------|
| `buyShares(amount, prizeAddress)` | Purchase shares in current game |
| `submitVote(gameId, decision)` | Vote during voting phases |

### Operator Functions

| Function | Description |
|----------|-------------|
| `requestRandomWords(gameId)` | Request VRF randomness |
| `processVotingResults(gameId)` | Process voting and advance stage |
| `distributeConsolationPrizes(...)` | Batch distribute consolation prizes |
| `distributeFinalPrize(gameId)` | Distribute final prize to winner |

### Admin Functions

| Function | Description |
|----------|-------------|
| `setOperator(address, bool)` | Manage operator roles |
| `pauseGame()` / `unpauseGame()` | Circuit breaker |
| `setPlatformFeeWallet(address)` | Update fee wallet |
| `updateVRFConfig(config)` | Update VRF configuration |
| `emergencyLUSDWithdrawal(to, amount)` | Emergency withdrawal (non-prize funds only) |

## 🔄 Game Lifecycle

```
Buying → CapReached → VRF_Request → Eliminating → Voting8 → Voting4 → Voting2 → Finished
```

1. **Buying:** Users purchase shares until cap is reached
2. **CapReached:** Cap reached, awaiting VRF request
3. **VRF_Request:** Randomness requested from Chainlink
4. **Eliminating:** Random elimination to 8 participants
5. **Voting8/4/2:** Progressive voting rounds
6. **Finished:** Winner determined, prizes distributed

## 💰 Financial Model

| Component | Percentage |
|-----------|------------|
| Platform Fee | 10% |
| Prize Pool | 90% |
| → Final Prize | 85% of pool |
| → Consolation | 5% of pool |

### Dynamic Cap Adjustment

- **Faster than 7 days:** +20% cap for next game
- **Slower than 7 days:** -20% cap for next game
- **Minimum cap:** 100 LUSD

## 🔐 Security Considerations

1. **Reentrancy:** All external functions protected with `nonReentrant`
2. **Access Control:** Strict `onlyOwner` and `onlyOperator` modifiers
3. **Pausability:** Emergency pause capability for critical functions
4. **Safe Transfers:** Using OpenZeppelin's `SafeERC20`
5. **Integer Safety:** Solidity 0.8.20 built-in overflow protection
6. **Upgrade Safety:** UUPS pattern with owner-only authorization

## 📊 Gas Optimization

- Struct packing for storage efficiency
- Minimal storage writes
- Event-driven off-chain data tracking
- Batch processing for prize distribution

## 🧪 Test Coverage

The test suite covers:

- ✅ Initialization
- ✅ Share purchasing
- ✅ Rollover mechanics
- ✅ VRF integration
- ✅ Elimination logic
- ✅ Voting system
- ✅ Prize distribution
- ✅ Admin functions
- ✅ Access control
- ✅ Edge cases

Target: **>95% code coverage**

## 📜 License

MIT License

## 🔗 Resources

- [Arbitrum Documentation](https://docs.arbitrum.io/)
- [Chainlink VRF v2](https://docs.chain.link/vrf/v2/introduction)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Foundry Book](https://book.getfoundry.sh/)
