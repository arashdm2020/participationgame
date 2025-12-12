# 📋 Participation Game - Complete Project Documentation

## 🎯 Overview

**Participation Game** is a trustless decentralized lottery system built on **Arbitrum Layer 2** using **LUSD** (Liquity USD) as the primary token. The project consists of two main components:

1. **Smart Contract** - Solidity contract built with Foundry (633 lines of production code)
2. **Frontend** - Next.js 16 web application with full Web3 integration

The system allows users to participate in a lottery by purchasing shares with LUSD tokens. Once the token cap is reached, a random elimination process selects 8 participants who then go through multiple voting rounds until a final winner emerges.

---

## 🏗️ Project Architecture

```
📦 ParticipationGame/
├── 📂 src/                          # Solidity Contracts
│   ├── ParticipationGame.sol        # Main contract (633 lines)
│   └── mocks/
│       └── MockLUSD.sol             # Mock LUSD for testing (47 lines)
├── 📂 test/                         # Foundry Tests
│   ├── ParticipationGame.t.sol      # Comprehensive tests (600 lines)
│   └── helpers/
│       └── ParticipationGameTestHelper.sol
├── 📂 script/                       # Deployment Scripts
│   └── Deploy.s.sol                 # Deploy + Upgrade scripts (109 lines)
├── 📂 frontend/                     # Web Interface
│   ├── src/app/                     # Next.js Pages (9 routes)
│   ├── src/components/              # React Components (11 components)
│   ├── src/config/                  # Contract ABIs & Network configs
│   ├── src/lib/                     # Custom hooks & utilities
│   └── prisma/                      # Database schema
├── 📂 broadcast/                    # Deployment artifacts
└── 📄 Config files (foundry.toml, package.json, etc.)
```

---

## 👤 User Experience & User Flows

### Flow 1: New User Joining the Game

1. **Connect Wallet** - User connects MetaMask or any WalletConnect-compatible wallet via RainbowKit
2. **Check Network** - System verifies user is on Arbitrum Sepolia (chainId: 421614)
3. **Get LUSD** - User obtains LUSD tokens (via faucet on testnet or swap on mainnet)
4. **View Game State** - Home page displays current game ID, prize pool, participant count, and progress bar
5. **Approve LUSD** - User approves the contract to spend their LUSD tokens
6. **Buy Shares** - User selects amount (quick buttons: 10, 20, 50, 100 or custom) and purchases shares
7. **Confirmation** - Transaction confirmed, user sees their shares on the dashboard

### Flow 2: Participating in Voting (After Elimination)

1. **Random Selection** - Chainlink VRF selects 8 random participants using Fisher-Yates shuffle
2. **Notification** - Active participants see voting panel become active
3. **Cast Vote** - Users vote "Continue" (true) or "Stop" (false) within 24-hour deadline
4. **View Results** - Real-time vote tally displayed with progress bars
5. **Elimination** - If "Continue" wins, half the participants are randomly eliminated
6. **Repeat** - Process continues through Voting8 → Voting4 → Voting2 stages
7. **Winner Declaration** - Final winner determined when voting ends or at Voting2 stage

### Flow 3: Admin/Operator Actions

1. **Access Admin Panel** - Only Owner or Operator addresses can access `/admin`
2. **Monitor Game State** - View current game status, revenue, participant count
3. **Request VRF** - When game reaches CapReached status, operator triggers VRF request
4. **Process Voting** - After voting deadline passes, operator processes results
5. **Distribute Prizes** - Operator distributes final prize (85%) and consolation prizes (5%)
6. **Emergency Controls** - Owner can pause/unpause the entire contract

---

## 💰 Financial Model

| Component | Percentage | Description |
|-----------|------------|-------------|
| **Platform Fee** | 10% | Transferred immediately to platform wallet on each purchase |
| **Prize Pool** | 90% | Held in contract until game ends |
| → Final Prize | 85% of pool | Goes to the single winner |
| → Consolation Prizes | 5% of pool | Distributed to runners-up in batches |

### Dynamic Cap System

The token cap adjusts automatically based on game duration:

| Scenario | Adjustment | Example |
|----------|------------|---------|
| Game completes in < 7 days | +20% cap | 10,000 → 12,000 LUSD |
| Game completes in > 7 days | -20% cap | 10,000 → 8,000 LUSD |
| Minimum cap enforced | Floor: 100 LUSD | Never drops below 100 |

### Rollover Mechanism

When a user's purchase exceeds the remaining cap:
1. The amount up to the cap goes to the current game
2. Excess automatically rolls over to the next game
3. A new game is created with adjusted cap
4. User receives shares in both games

---

## 🔄 Game Lifecycle (Detailed)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  1. BUYING                                                                   │
│     - Users purchase shares with LUSD                                        │
│     - 10% fee transferred immediately to platform wallet                     │
│     - 90% added to prize pool                                                │
│     - Participants tracked in gameParticipantList mapping                    │
│     - Continues until totalRevenue >= tokenCap                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  2. CAP_REACHED                                                              │
│     - Triggered automatically when cap is reached                            │
│     - endTime recorded for cap adjustment calculation                        │
│     - Waiting for operator to request VRF                                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  3. VRF_REQUEST                                                              │
│     - Operator calls requestRandomWords(gameId)                              │
│     - Request sent to Chainlink VRF Coordinator                              │
│     - Request ID mapped to game ID                                           │
│     - Typically takes 2-5 minutes on Arbitrum                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  4. ELIMINATING                                                              │
│     - Chainlink callback delivers random seed                                │
│     - Fisher-Yates shuffle algorithm selects 8 participants                  │
│     - If < 8 participants, all become active                                 │
│     - activeParticipants array populated                                     │
│     - Immediate transition to Voting8                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  5. VOTING8 (8 participants)                                                 │
│     - votingDeadline set to now + 24 hours                                   │
│     - Active participants can vote: true (continue) or false (stop)          │
│     - Each participant can only vote once per stage                          │
│     - Vote tallies tracked in voteTallies mapping                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  6. VOTING4 (4 participants) - If "Continue" won                            │
│     - Half of participants randomly eliminated                               │
│     - New 24-hour voting period                                              │
│     - hasVotedInCurrentStage reset for all participants                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  7. VOTING2 (2 participants) - If "Continue" won                            │
│     - Final voting round                                                     │
│     - After this round, game ALWAYS ends regardless of vote outcome          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  8. FINISHED                                                                 │
│     - Winner determined (last standing or random from remaining)             │
│     - gameWinners mapping updated                                            │
│     - Operator distributes consolation prizes in batches (max 50 per tx)     │
│     - Operator distributes final prize (85% of pool)                         │
│     - Next game cap adjusted based on this game's duration                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Smart Contract Functions (Complete Reference)

### User Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `buyShares` | `buyShares(uint256 amount, address optionalPrizeAddress)` | Purchase shares. If prizeAddress is zero, prizes go to msg.sender. Handles rollover automatically. |
| `submitVote` | `submitVote(uint256 gameId, bool decision)` | Vote during voting phases. true = continue, false = stop. Can only vote once per stage. |

### Operator Functions (Requires `isOperator[msg.sender] == true`)

| Function | Signature | Description |
|----------|-----------|-------------|
| `requestRandomWords` | `requestRandomWords(uint256 gameId)` | Trigger Chainlink VRF request. Only works when status is CapReached. |
| `processVotingResults` | `processVotingResults(uint256 gameId)` | Process votes after deadline. Advances to next stage or finishes game. |
| `distributeFinalPrize` | `distributeFinalPrize(uint256 gameId)` | Send 85% of prize pool to winner. Can only be called once. |
| `distributeConsolationPrizes` | `distributeConsolationPrizes(address[] winners, uint256[] amounts, uint256 batchSize)` | Batch distribute consolation prizes. Max 50 per transaction. |

### Admin Functions (Requires `onlyOwner`)

| Function | Signature | Description |
|----------|-----------|-------------|
| `setOperator` | `setOperator(address operator, bool isAuthorized)` | Grant or revoke operator role. |
| `pauseGame` | `pauseGame()` | Emergency pause. Blocks buyShares and submitVote. |
| `unpauseGame` | `unpauseGame()` | Resume normal operation. |
| `setPlatformFeeWallet` | `setPlatformFeeWallet(address newWallet)` | Change fee destination. |
| `updateVRFConfig` | `updateVRFConfig(VRFConfig calldata _vrfConfig)` | Update Chainlink VRF settings. |
| `emergencyLUSDWithdrawal` | `emergencyLUSDWithdrawal(address to, uint256 amount)` | Withdraw non-prize funds only. Protected from draining prize pool. |

### View Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `getGameDetails(gameId)` | `GameDetails` | Full game state including cap, revenue, pool, status, timestamps |
| `getParticipant(gameId, user)` | `Participant` | User's shares, prize address, vote status |
| `getParticipantCount(gameId)` | `uint256` | Total number of participants |
| `getActiveParticipants(gameId)` | `address[]` | List of participants still in voting |
| `getVoteTallies(gameId)` | `(uint256, uint256)` | Continue votes and Stop votes |
| `getConsolationPrizePool(gameId)` | `uint256` | 5% of prize pool |
| `getFinalPrizePool(gameId)` | `uint256` | 85% of prize pool |

---

## 🔐 Security Implementation

### Implemented Patterns

| Pattern | Implementation | Protection Against |
|---------|----------------|-------------------|
| **UUPS Upgradeable** | `UUPSUpgradeable` + `_authorizeUpgrade` with `onlyOwner` | Unauthorized upgrades |
| **ReentrancyGuard** | `nonReentrant` modifier on all state-changing functions | Reentrancy attacks |
| **Pausable** | `whenNotPaused` on `buyShares` and `submitVote` | Emergency situations |
| **Access Control** | `onlyOwner` and `onlyOperator` modifiers | Unauthorized admin actions |
| **Checks-Effects-Interactions** | State changes before external calls | Reentrancy, state inconsistency |
| **SafeERC20** | All token transfers via `safeTransfer` / `safeTransferFrom` | Failed silent transfers |
| **Custom Errors** | Gas-efficient error handling (Solidity 0.8.24) | Reduced gas costs |
| **Storage Gap** | `uint256[40] private __gap` | Safe upgrade storage slots |

### Chainlink VRF v2 Configuration

```solidity
VRFConfig {
    coordinator: 0x50d47e4142598E3411aA864e08a44284e471AC6f  // Arbitrum Sepolia
    subscriptionId: <from Chainlink dashboard>
    callbackGasLimit: 500,000
    keyHash: 0x027f94ff1465b3525f9fc03e9ff7d6d2c0953482246dd6ae07570c45d6631414
    requestConfirmations: 3
}
```

---

## 🖥️ Frontend Implementation

### Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js | 16.0.5 |
| Styling | TailwindCSS | 3.4.17 |
| UI Components | Radix UI | Various |
| Icons | Lucide React | 0.555.0 |
| Web3 Provider | wagmi | 2.12.0 |
| Ethereum Library | viem | 2.40.3 |
| Wallet Connection | RainbowKit | 2.1.0 |
| State Management | Zustand | 5.0.8 |
| Data Fetching | TanStack Query | 5.90.11 |
| i18n | next-intl | 4.5.6 |
| Database ORM | Prisma | 6.19.0 |
| Charts | Recharts | 3.5.1 |
| Font | Vazirmatn | 33.0.3 (Persian) |

### Pages & Routes

| Route | Component | Description | Status |
|-------|-----------|-------------|--------|
| `/` | `page.tsx` | Home page with hero, game stats, buy shares, voting panel | ✅ Complete |
| `/dashboard` | `dashboard/page.tsx` | User dashboard with personal stats, shares, voting | ✅ Complete |
| `/admin` | `admin/page.tsx` | Admin panel with game controls, VRF, prize distribution | ✅ Complete |
| `/how-it-works` | `how-it-works/page.tsx` | 4-step guide explaining game mechanics | ✅ Complete |
| `/faq` | `faq/page.tsx` | Frequently asked questions | ⚠️ Exists but needs content |
| `/winners` | `winners/page.tsx` | Historical winners list | ⚠️ Exists but needs implementation |

### Key Components

| Component | File | Functionality |
|-----------|------|---------------|
| `BuyShares` | `components/game/BuyShares.tsx` | Amount selector, approve button, buy button, balance display, network check |
| `VotingPanel` | `components/game/VotingPanel.tsx` | Stage tabs, vote buttons, countdown timer, results bars, voter status |
| `GameStats` | `components/game/GameStats.tsx` | Current game statistics display |
| `GameProgress` | `components/game/GameProgress.tsx` | Visual progress through game stages |
| `WinnersHistory` | `components/game/WinnersHistory.tsx` | Display current game winner with prize amount |
| `Header` | `components/layout/Header.tsx` | Navigation, wallet connection, language switcher |
| `Footer` | `components/layout/Footer.tsx` | Footer links |

### Custom Hooks (`src/lib/hooks.ts`)

```typescript
useContractData()    // Returns: gameId, gameDetails, participantCount, activeParticipants,
                     //          userShares, isParticipant, lusdBalance, lusdAllowance,
                     //          voteTallies, gameWinner, totalPrizePoolAllGames

useGameStatus()      // Returns: status, statusName, isBuying, isCapReached, 
                     //          isEliminating, isVoting, isFinished, votingStage
```

### Database Schema (Prisma)

| Model | Purpose |
|-------|---------|
| `User` | Wallet addresses and admin status |
| `Game` | Mirror of on-chain game data for faster queries |
| `Participation` | Record of share purchases with tx hashes |
| `Vote` | Record of votes cast with tx hashes |
| `AdminAction` | Audit log of admin operations |
| `AppSettings` | Contract addresses and network configuration |
| `Winner` | Historical winners with prize amounts |

---

## ✅ Completed Parts

### Smart Contract (100% Complete)

- [x] Core game logic with all 8 states
- [x] Share purchasing with rollover
- [x] Dynamic cap adjustment
- [x] Chainlink VRF integration
- [x] Fisher-Yates elimination algorithm
- [x] Three-stage voting system (8→4→2)
- [x] Prize distribution (final + consolation batches)
- [x] All admin functions
- [x] UUPS upgradeability
- [x] All security patterns
- [x] Comprehensive events
- [x] 40+ unit tests
- [x] Deploy scripts (deploy + upgrade)
- [x] Mock LUSD token for testing

### Frontend (85% Complete)

- [x] Project setup with Next.js 16
- [x] TailwindCSS styling with dark theme
- [x] RainbowKit wallet integration
- [x] wagmi hooks for contract interaction
- [x] Home page with full game display
- [x] Buy shares component with approval flow
- [x] Voting panel with real-time updates
- [x] Game progress visualization
- [x] User dashboard
- [x] Admin panel with all operator functions
- [x] How it works page
- [x] Multi-language support (EN/FA structure)
- [x] Prisma database schema
- [x] Auto-refresh on new blocks
- [x] Network detection and warnings
- [x] Responsive mobile design

### Documentation (90% Complete)

- [x] README.md (English)
- [x] README_FA.md (Persian)
- [x] QUICKSTART.md
- [x] SETUP_GUIDE_WINDOWS.md
- [x] TESTING_GUIDE.md
- [x] NETWORK_CONFIG.md
- [x] IMPLEMENTATION_CHECKLIST.md
- [x] PROJECT_INDEX.md

---

## ❌ Missing / Incomplete Parts

### Smart Contract

| Item | Priority | Notes |
|------|----------|-------|
| Mainnet deployment | High | Only testnet deployed so far |
| Security audit | High | Required before mainnet |
| Gas optimization audit | Medium | Current implementation is reasonable |
| Formal verification | Low | Optional for critical functions |

### Frontend

| Item | Priority | Notes |
|------|----------|-------|
| FAQ page content | Medium | Page exists but needs questions/answers |
| Winners history page | Medium | Only shows current game winner, needs historical list |
| Event indexer/listener | Medium | Currently relies on polling, could use event subscriptions |
| Prisma API routes | Medium | Schema defined but no API routes to sync blockchain data |
| Error handling improvements | Medium | Some edge cases not fully handled in UI |
| Loading skeletons | Low | Current loading states are basic |
| Transaction history | Low | No page showing user's past transactions |
| Notifications | Low | No toast/notification system for tx confirmations |
| PWA support | Low | Not configured as Progressive Web App |

### Backend Services (Not Started)

| Item | Priority | Notes |
|------|----------|-------|
| Event indexer service | High | Need to sync blockchain events to database |
| Cron job for game monitoring | Medium | Alert when VRF or voting processing needed |
| Email/Push notifications | Low | Notify users when they're selected for voting |
| Analytics dashboard | Low | Track participation rates, revenues, etc. |

### DevOps / Infrastructure

| Item | Priority | Notes |
|------|----------|-------|
| CI/CD pipeline | Medium | No GitHub Actions configured |
| Monitoring/Alerting | Medium | No Sentry, DataDog, or similar |
| Testnet deployment automation | Medium | Currently manual |
| Database migrations | Low | Prisma migrate not configured |

### Testing

| Item | Priority | Notes |
|------|----------|-------|
| Frontend unit tests | Medium | No Jest/Vitest tests |
| E2E tests | Medium | No Playwright/Cypress tests |
| Integration tests | Low | Contract-frontend integration |
| Fuzz testing | Low | Additional Foundry fuzz tests |

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER FLOW                                       │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌──────────┐         ┌──────────────┐         ┌───────────────────┐
  │  User    │────────▶│  Frontend    │────────▶│  Smart Contract   │
  │  Wallet  │  LUSD   │  (Next.js)   │  wagmi  │  (Arbitrum L2)    │
  └──────────┘         └──────────────┘         └─────────┬─────────┘
                              │                           │
                              │                    ┌──────┴──────┐
                              │                    │             │
                              ▼                    ▼             ▼
                       ┌──────────────┐     ┌──────────┐  ┌──────────┐
                       │   Prisma DB  │     │ Platform │  │ Chainlink│
                       │  (PostgreSQL)│     │  Wallet  │  │   VRF    │
                       └──────────────┘     │  (10%)   │  │          │
                                            └──────────┘  └──────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            ADMIN FLOW                                        │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌──────────┐         ┌──────────────┐         ┌───────────────────┐
  │  Admin   │────────▶│  Admin Panel │────────▶│  Smart Contract   │
  │  Wallet  │         │  (/admin)    │         │                   │
  └──────────┘         └──────────────┘         └───────────────────┘
       │                                                │
       │                                                │
       └────────── Access Control Check ────────────────┘
                   (isOwner || isOperator)
```

---

## 🚀 Deployment Status

### Arbitrum Sepolia (Testnet)

| Item | Address | Status |
|------|---------|--------|
| Implementation | Deployed | ✅ |
| Proxy | `0xd98b85650Fa30d849217e540A563D26Eb21f8E46` | ✅ |
| Mock LUSD | `0x8d13F248f3D7be222FF5E9743E392C76948C1028` | ✅ |
| VRF Subscription | Configured | ✅ |

### Arbitrum One (Mainnet)

| Item | Status |
|------|--------|
| Implementation | ❌ Not deployed |
| Proxy | ❌ Not deployed |
| LUSD Integration | ❌ Need real LUSD address |
| VRF Subscription | ❌ Not created |

---

## 📝 Recommendations & Next Steps

### Immediate (Before Mainnet)

1. **Security Audit** - Engage a professional auditor (Trail of Bits, OpenZeppelin, etc.)
2. **Complete Winners History** - Implement historical winners page with database sync
3. **Event Indexer** - Build service to sync blockchain events to Prisma database
4. **Error Handling** - Improve frontend error messages and edge case handling

### Short-term

1. **CI/CD Pipeline** - Set up GitHub Actions for automated testing
2. **Monitoring** - Integrate Sentry for error tracking
3. **Admin Notifications** - Alert when operator action is needed
4. **FAQ Content** - Write comprehensive FAQ answers

### Long-term

1. **Mobile App** - React Native version
2. **Multi-chain** - Deploy to other L2s (Optimism, Base)
3. **Governance** - Token-based governance for parameter changes
4. **Referral System** - Incentivize user growth

---

*This document was generated on December 12, 2025.*
*Last updated: December 12, 2025.*
