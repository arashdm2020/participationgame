# Participation Game — UI Specification v2.0

**Date:** December 13, 2025  
**Status:** CORRECTED NAVIGATION ARCHITECTURE

---

## 1. Updated Information Architecture

### Navigation Structure Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        PUBLIC PAGES                              │
│                    (Top Navbar, No Sidebar)                      │
├─────────────────────────────────────────────────────────────────┤
│  /              Home (Game Dashboard)                           │
│  /buy           Buy Shares                                      │
│  /vote          Voting (when active)                            │
│  /winners       Winners History                                 │
│  /how-it-works  How It Works                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        PANEL PAGES                               │
│                    (Sidebar Navigation)                          │
├─────────────────────────────────────────────────────────────────┤
│  /panel         User Panel (requires wallet)                    │
│  /admin         Admin Panel (requires operator/owner)           │
└─────────────────────────────────────────────────────────────────┘
```

### Page Hierarchy

| Route | Layout | Navigation | Auth Required |
|-------|--------|------------|---------------|
| `/` | Full-width | **Top Navbar** | No |
| `/buy` | Full-width | **Top Navbar** | Wallet only |
| `/vote` | Full-width | **Top Navbar** | Wallet only |
| `/winners` | Full-width | **Top Navbar** | No |
| `/how-it-works` | Full-width | **Top Navbar** | No |
| `/panel` | Sidebar layout | **Sidebar** | Wallet required |
| `/admin` | Sidebar layout | **Sidebar** | Operator/Owner |

---

## 2. Top Navbar (Public Pages)

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Logo]  Home  Buy  Vote  Winners  How It Works     [Status] [Network] [Wallet]│
└─────────────────────────────────────────────────────────────────────────────┘
     │                    │                               │        │       │
     └──Brand             └──Primary Nav                  └─Status └Network└Wallet
```

### Component Breakdown

**Left Section:**
| Component | Behavior |
|-----------|----------|
| **Logo** | Brand mark + "Participation" text. Links to `/`. |
| **Primary Nav** | Horizontal menu items with hover states |

**Primary Navigation Items:**
1. **Home** → `/`
2. **Buy Shares** → `/buy`
3. **Voting** → `/vote` (shows badge if voting is active)
4. **Winners** → `/winners`
5. **How It Works** → `/how-it-works`

**Right Section:**
| Component | Behavior |
|-----------|----------|
| **Game Status Pill** | Shows current game state with appropriate color |
| **Network Badge** | Shows "Arbitrum Sepolia" with status dot (green if correct, red if wrong) |
| **Wallet Button** | RainbowKit connect button or connected address dropdown |
| **Panel Link** | Icon button linking to `/panel` (only when wallet connected) |

### Game Status Pill States

| Status | Label | Color |
|--------|-------|-------|
| 0 | "Buying Open" | Green (`#10B981`) |
| 1 | "Cap Reached" | Amber (`#F59E0B`) |
| 2 | "VRF Pending" | Amber + spinner |
| 3 | "Eliminating" | Amber + spinner |
| 4 | "Voting (8)" | Blue (`#3B82F6`) |
| 5 | "Voting (4)" | Blue |
| 6 | "Final Vote" | Blue + pulse |
| 7 | "Finished" | Green |

### Responsive Behavior

**Desktop (≥1024px):**
- Full horizontal navbar with all items visible

**Tablet (768px - 1023px):**
- Primary nav collapses to essential items: Home, Buy, Vote
- Hamburger menu for secondary items

**Mobile (<768px):**
- Logo + Status Pill + Wallet (compressed)
- Hamburger menu for all navigation
- Full-screen mobile menu overlay

### Navbar Styling

```
Height: 64px
Background: #0D1117 (bg-surface)
Border-bottom: 1px solid #21262D (border-subtle)
Position: sticky top-0
Z-index: 50

Nav Item:
  - Default: text-secondary (#8B949E)
  - Hover: text-primary (#F0F6FC) + bg-hover (#1C2128)
  - Active: text-accent-primary (#10B981) + underline

Status Pill:
  - Padding: 6px 12px
  - Border-radius: 9999px (full)
  - Font: body-sm, medium weight
  - Includes status dot (8px circle)
```

---

## 3. Sidebar Navigation (Panels Only)

### When Sidebar Appears

Sidebar is **ONLY** used for:
- `/panel` — User Panel
- `/admin` — Admin Panel

### Visual Differentiation

The sidebar layout must clearly communicate "you are in a private panel area" through:
- Slightly different background shade
- Panel name in sidebar header
- Back to Home link prominently placed

### Sidebar Structure (User Panel)

```
┌──────────────────────────────┐
│  ← Back to Home              │
│                              │
│  ┌────────────────────────┐  │
│  │  MY PANEL              │  │
│  │  0x1234...5678         │  │
│  └────────────────────────┘  │
│                              │
│  ────────────────────────────│
│                              │
│  ● Wallet                    │
│  ○ Purchase History          │
│  ○ Games Participated        │
│                              │
│  ────────────────────────────│
│                              │
│  [Disconnect Wallet]         │
│                              │
└──────────────────────────────┘
```

### Sidebar Structure (Admin Panel)

```
┌──────────────────────────────┐
│  ← Back to Home              │
│                              │
│  ┌────────────────────────┐  │
│  │  🛡 ADMIN PANEL        │  │
│  │  Owner / Operator      │  │
│  └────────────────────────┘  │
│                              │
│  ────────────────────────────│
│                              │
│  ● Dashboard                 │
│  ○ Game Actions              │
│  ○ Emergency Controls        │
│                              │
│  ────────────────────────────│
│                              │
│  Contract: 0x1234...         │
│  Network: Arbitrum Sepolia   │
│                              │
└──────────────────────────────┘
```

### Sidebar Styling

```
Width: 260px (desktop), 64px collapsed (tablet), hidden (mobile - slide drawer)
Background: #07090C (bg-root)
Border-right: 1px solid #21262D

Header:
  - Background: #0D1117 (bg-surface)
  - Height: 80px
  - Panel name + address

Nav Items:
  - Height: 44px
  - Padding: 12px 16px
  - Active: accent background + left border
```

---

## 4. User Panel — Component Specification

### STRICT SCOPE: Only These Sections Allowed

The User Panel contains **exactly four sections** and nothing else:

```
A) Wallet Details
B) Purchase History
C) Games Participated
D) Game Result Detail (drill-in, optional)
```

**Prohibited items:**
- ❌ Charts or graphs
- ❌ Leaderboards
- ❌ Portfolio value
- ❌ Promotional cards
- ❌ Random statistics
- ❌ Social features
- ❌ Settings (beyond disconnect)

---

### A) Wallet Details Section

**Purpose:** Display connected wallet information and token status

**Component: `WalletDetailsCard`**

```
┌─────────────────────────────────────────────────────────────┐
│  WALLET DETAILS                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Address                                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 0x1234567890abcdef1234567890abcdef12345678    [📋]  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Network                                                    │
│  Arbitrum Sepolia ●                                        │
│                                                             │
│  ───────────────────────────────────────────────────────   │
│                                                             │
│  LUSD Balance                 LUSD Allowance               │
│  1,234.56                     500.00                       │
│  LUSD                         LUSD approved                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Data Fields:**
| Field | Source | Format |
|-------|--------|--------|
| Address | `useAccount().address` | Full address, copy button |
| Network | `useChainId()` | Chain name + status dot |
| LUSD Balance | `balanceOf(address)` | Formatted number + "LUSD" |
| LUSD Allowance | `allowance(address, contract)` | Formatted number + "approved" |

---

### B) Purchase History Section

**Purpose:** Display all share purchases by this wallet

**Component: `PurchaseHistoryTable`**

```
┌─────────────────────────────────────────────────────────────┐
│  PURCHASE HISTORY                                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Date          Amount      Shares    Game    Tx            │
│  ─────────────────────────────────────────────────────────  │
│  Dec 12, 2025  100 LUSD    100       #42     [View →]      │
│  Dec 10, 2025  50 LUSD     50        #42     [View →]      │
│  Dec 05, 2025  200 LUSD    200       #41     [View →]      │
│  Nov 28, 2025  75 LUSD     75        #40     [View →]      │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  Showing 4 of 12                    [Load More]            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Table Columns:**
| Column | Description |
|--------|-------------|
| **Date** | Timestamp of purchase (formatted) |
| **Amount** | LUSD spent (formatted with decimals) |
| **Shares** | Shares received |
| **Game** | Game ID with # prefix |
| **Tx** | Link to block explorer |

**Behavior:**
- Sorted by date descending (newest first)
- Pagination: Show 10, "Load More" button
- Empty state: "No purchases yet"

---

### C) Games Participated Section

**Purpose:** List all games where user has/had shares

**Component: `GamesParticipatedTable`**

```
┌─────────────────────────────────────────────────────────────┐
│  GAMES PARTICIPATED                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Game    Status        Shares   Role        Result         │
│  ─────────────────────────────────────────────────────────  │
│  #42     Voting (8)    150      Active ●    -              │
│  #41     Finished      100      Eliminated  Lost R2        │
│  #40     Finished      200      Winner 🏆   +8,500 LUSD    │
│  #39     Finished      50       Not Selected -             │
│                                                             │
│  [View Details]                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Table Columns:**
| Column | Description |
|--------|-------------|
| **Game** | Game ID |
| **Status** | Current game status (with color badge) |
| **Shares** | User's share count in that game |
| **Role** | Active Participant / Eliminated / Not Selected / Winner |
| **Result** | Winnings amount or elimination round |

**Status Badge Colors:**
- Buying/CapReached: Amber
- Voting stages: Blue
- Finished: Gray (unless winner, then Gold)

**Role Indicators:**
- `Active ●` — Green dot, user is active in current voting
- `Eliminated` — Red text
- `Not Selected` — Gray text
- `Winner 🏆` — Gold trophy icon

**Result Display:**
- Won: `+X,XXX LUSD` in green
- Lost: `Lost R1/R2/R3` in gray
- Not selected: `-`
- In progress: `-`

---

### D) Game Result Detail (Optional Drill-in)

**Purpose:** Expanded view of a specific game's outcome

**Trigger:** Click "View Details" on any game row

**Component: `GameDetailModal` or `/panel/game/[id]`**

```
┌─────────────────────────────────────────────────────────────┐
│  GAME #41 DETAILS                                     [X]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Status: Finished                                           │
│  Duration: Dec 5-10, 2025 (5 days)                         │
│  Total Participants: 124                                    │
│  Prize Pool: 10,000 LUSD                                   │
│                                                             │
│  ───────────────────────────────────────────────────────   │
│                                                             │
│  YOUR PARTICIPATION                                         │
│  Shares: 100                                                │
│  Selected for Voting: Yes                                   │
│  Eliminated: Round 2 (Voting 4)                            │
│  Winnings: 0 LUSD                                          │
│                                                             │
│  ───────────────────────────────────────────────────────   │
│                                                             │
│  VOTING HISTORY                                             │
│  Round 1 (8→4): You voted CONTINUE ✓                       │
│  Round 2 (4→2): Eliminated before voting                   │
│                                                             │
│  ───────────────────────────────────────────────────────   │
│                                                             │
│  WINNER                                                     │
│  0x89ab...cdef                                             │
│  Prize: 8,500 LUSD                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Sections:**
1. **Game Summary** — Status, duration, participants, prize pool
2. **Your Participation** — Shares, selection status, elimination round, winnings
3. **Voting History** — Per-round votes (if user was active participant)
4. **Winner** — Winner address and prize amount

**Read-only:** No actions available in this view

---

## 5. Admin Panel — Component Specification

### Sidebar Navigation Items

1. **Dashboard** — Overview stats
2. **Game Actions** — VRF, voting, distribution
3. **Emergency Controls** — Pause/Unpause

### Dashboard Section

```
┌─────────────────────────────────────────────────────────────┐
│  ADMIN DASHBOARD                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Game #42 │  │ Voting8  │  │ 124      │  │ Active   │   │
│  │          │  │ Status   │  │ Players  │  │ Contract │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
│  Prize Pool: 10,000 LUSD                                   │
│  Progress: ████████████████████ 100%                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Game Actions Section

```
┌─────────────────────────────────────────────────────────────┐
│  GAME ACTIONS                                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⚡ REQUEST VRF                                      │   │
│  │                                                     │   │
│  │ Request random numbers from Chainlink VRF.         │   │
│  │                                                     │   │
│  │ Prerequisite: Game status must be CapReached       │   │
│  │ Current Status: Voting8 ❌                         │   │
│  │                                                     │   │
│  │ [Request VRF] (disabled)                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🗳 PROCESS VOTING                                   │   │
│  │                                                     │   │
│  │ Tally votes and advance to next stage.             │   │
│  │                                                     │   │
│  │ Prerequisite: Voting deadline must have passed     │   │
│  │ Deadline: Dec 13, 14:30 (2h remaining) ⏳          │   │
│  │                                                     │   │
│  │ [Process Voting] (disabled)                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🎁 DISTRIBUTE PRIZE                                 │   │
│  │                                                     │   │
│  │ Send prize to winner and start new game.           │   │
│  │                                                     │   │
│  │ Prerequisite: Game status must be Finished         │   │
│  │ Current Status: Voting8 ❌                         │   │
│  │                                                     │   │
│  │ [Distribute Prize] (disabled)                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Emergency Controls Section

```
┌─────────────────────────────────────────────────────────────┐
│  ⚠️ EMERGENCY CONTROLS                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Contract Status: ACTIVE ●                                  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔴 PAUSE CONTRACT                                   │   │
│  │                                                     │   │
│  │ Pausing will:                                       │   │
│  │ • Stop all share purchases                         │   │
│  │ • Stop all voting                                  │   │
│  │ • NOT affect existing funds                        │   │
│  │                                                     │   │
│  │ This action is REVERSIBLE.                         │   │
│  │                                                     │   │
│  │ [Pause Contract]                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Only the contract OWNER can pause/unpause.                │
│  Current role: Owner ✓                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Confirmation Modal (Required for Destructive Actions)

```
┌─────────────────────────────────────────────────────────────┐
│  ⚠️ CONFIRM ACTION                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  You are about to:                                          │
│                                                             │
│  PAUSE THE CONTRACT                                         │
│                                                             │
│  This will prevent all user interactions.                   │
│                                                             │
│  Type "PAUSE" to confirm:                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [Cancel]                            [Confirm] (disabled)  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. State-Driven Behavior Notes

### Home Page State Changes

| Game Status | Navbar Status Pill | Page Content |
|-------------|-------------------|--------------|
| Buying | Green "Buying Open" | Prize pool, buy CTA prominent |
| CapReached | Amber "Cap Reached" | Waiting message |
| VRF_Request | Amber "VRF Pending" + spin | Spinner, explanation |
| Eliminating | Amber "Eliminating" + spin | Animation/progress |
| Voting8/4/2 | Blue "Voting (X)" | Countdown, vote CTAs |
| Finished | Green "Finished" | Winner announcement |

### User Panel State Changes

**Games Participated Table:**
- Active games show real-time status badge
- Current voting stage highlighted
- User's active participant status shown with indicator

**Purchase History:**
- Static data, no real-time updates needed
- Can add loading skeleton on initial load

### Admin Panel State Changes

**Action Buttons:**
- Disabled with reason shown when prerequisites not met
- Enabled with green indicator when action is available
- Loading state during transaction
- Success/error toast after transaction

---

## 7. UX Rationale

### Why Navbar for Public Pages?

1. **First-time visitors** see a familiar web navigation pattern
2. **Horizontal space** is preserved for game content
3. **Sticky behavior** keeps navigation accessible during scroll
4. **Marketing-friendly** — public pages can feel more open and inviting

### Why Sidebar for Panels?

1. **Panel = workspace** — sidebar indicates "you're in a utility area"
2. **Vertical navigation** scales with more panel sections
3. **Persistent context** — user always sees wallet/role info
4. **Clear separation** from public marketing pages

### Why Minimal User Panel?

1. **Utility over decoration** — users come for specific info
2. **Fast loading** — no unnecessary data fetches
3. **Trust** — showing exactly what's relevant, nothing distracting
4. **Privacy** — no leaderboards exposing user data

### Why Confirmation for Admin Actions?

1. **Irreversibility protection** — type-to-confirm forces deliberate action
2. **Audit trail** — user must acknowledge consequences
3. **Industry standard** — expected pattern for admin interfaces

---

## 8. Summary: Component Checklist

### Public Pages (Navbar Layout)

| Page | Key Components |
|------|----------------|
| `/` | PrizePoolCard, BuySharesCTA, GameProgress, QuickInfo |
| `/buy` | AmountInput, ApprovalFlow, PurchaseSummary |
| `/vote` | CountdownTimer, VoteCards (Continue/Stop), ParticipantList |
| `/winners` | WinnersList, GameHistoryTable |
| `/how-it-works` | StepCards (4 steps), FeatureHighlights |

### User Panel (Sidebar Layout)

| Section | Component |
|---------|-----------|
| Wallet Details | `WalletDetailsCard` |
| Purchase History | `PurchaseHistoryTable` |
| Games Participated | `GamesParticipatedTable` |
| Game Detail | `GameDetailModal` |

### Admin Panel (Sidebar Layout)

| Section | Component |
|---------|-----------|
| Dashboard | `AdminStatsGrid`, `ProgressCard` |
| Game Actions | `ActionCard` × 3 (VRF, Voting, Prize) |
| Emergency | `EmergencyControlCard`, `ConfirmationModal` |

---

**End of Specification v2.0**
