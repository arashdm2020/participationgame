# Participation Game — Complete UI Redesign Specification

**Version:** 2.0  
**Date:** December 13, 2025  
**Status:** FULL REPLACEMENT — All previous UI decisions are discarded.

---

## EXPLICIT STATEMENT

This document represents a **complete UI replacement**. No existing components, layouts, or design decisions from the current implementation should be carried forward. This is a ground-up redesign built on new principles, new visual language, and new information architecture.

---

# PART 1: DESIGN PHILOSOPHY

## 1.1 Core Principles

### Principle 1: Data-First, Not Decoration-First
Every pixel must earn its place. If a visual element doesn't communicate state, enable action, or provide context, it doesn't belong. This is a functional financial interface, not a marketing experience.

### Principle 2: State Is King
The game has 8 distinct states. The UI must transform meaningfully between states — not just swap text, but reconfigure visual hierarchy, available actions, and emotional tone.

### Principle 3: Trust Through Transparency
Users are depositing real money into a smart contract. Every number, every status, every countdown must feel authoritative and verifiable. No ambiguity. No hidden information.

### Principle 4: Tension When Appropriate
Voting phases are high-stakes moments. The UI should amplify this tension through color, animation, and countdown prominence — without becoming stressful or gamified.

### Principle 5: Restrained Power for Admins
Admin interfaces must feel capable but dangerous. Every destructive action should feel weighty. Confirmations are mandatory. The visual language should communicate "you are in control, be careful."

---

## 1.2 Visual DNA (Inspired by Reference)

From the reference image, we extract:

| Attribute | Interpretation |
|-----------|----------------|
| **Dark foundation** | Near-black backgrounds (#0B0E11, #111418) |
| **Emerald accents** | Primary action color, success states |
| **High contrast numbers** | Large, bold, monospace for financial data |
| **Card-based modularity** | Self-contained information units |
| **Subtle depth** | Cards lift slightly with shadow, not border |
| **Generous spacing** | Content breathes, never cramped |
| **Minimal chrome** | No decorative borders, minimal dividers |
| **Focused highlights** | One accent gradient per view maximum |

---

# PART 2: DESIGN SYSTEM

## 2.1 Color Palette

### Foundation Colors

```
--bg-root:        #07090C    // Deepest background (body)
--bg-surface:     #0D1117    // Card/panel background
--bg-elevated:    #161B22    // Elevated cards, modals
--bg-hover:       #1C2128    // Hover states on surfaces

--border-subtle:  #21262D    // Subtle card borders (optional)
--border-default: #30363D    // Default borders when needed
```

### Text Colors

```
--text-primary:   #F0F6FC    // Primary text, numbers
--text-secondary: #8B949E    // Labels, descriptions
--text-tertiary:  #484F58    // Disabled, placeholder
--text-inverse:   #0D1117    // Text on bright backgrounds
```

### Accent Colors

```
--accent-primary:    #10B981    // Emerald — primary actions, success
--accent-primary-hover: #34D399
--accent-primary-muted: rgba(16, 185, 129, 0.15)

--accent-secondary:  #3B82F6    // Blue — informational, links
--accent-secondary-muted: rgba(59, 130, 246, 0.15)
```

### Status Colors

```
--status-success:    #10B981    // Green — success, continue vote
--status-success-bg: rgba(16, 185, 129, 0.12)

--status-warning:    #F59E0B    // Amber — pending, caution
--status-warning-bg: rgba(245, 158, 11, 0.12)

--status-danger:     #EF4444    // Red — error, stop vote, destructive
--status-danger-bg:  rgba(239, 68, 68, 0.12)

--status-info:       #3B82F6    // Blue — informational
--status-info-bg:    rgba(59, 130, 246, 0.12)

--status-neutral:    #6B7280    // Gray — disabled, inactive
--status-neutral-bg: rgba(107, 114, 128, 0.12)
```

### Special: Gradient Accent

```
--gradient-primary: linear-gradient(135deg, #10B981 0%, #059669 100%)
--gradient-gold:    linear-gradient(135deg, #F59E0B 0%, #D97706 100%)
--gradient-danger:  linear-gradient(135deg, #EF4444 0%, #DC2626 100%)
```

---

## 2.2 Typography

### Font Stack

```
--font-sans:  'Inter', -apple-system, BlinkMacSystemFont, sans-serif
--font-mono:  'JetBrains Mono', 'SF Mono', Consolas, monospace
```

### Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `display-1` | 48px | 700 | 1.1 | Hero numbers (prize pool) |
| `display-2` | 36px | 700 | 1.15 | Large metrics |
| `heading-1` | 24px | 600 | 1.25 | Page titles |
| `heading-2` | 20px | 600 | 1.3 | Section titles |
| `heading-3` | 16px | 600 | 1.4 | Card titles |
| `body-lg` | 16px | 400 | 1.5 | Primary body |
| `body-md` | 14px | 400 | 1.5 | Default body |
| `body-sm` | 12px | 400 | 1.5 | Captions, labels |
| `mono-lg` | 20px | 500 | 1.3 | Large numbers |
| `mono-md` | 14px | 500 | 1.4 | Inline numbers |
| `mono-sm` | 12px | 500 | 1.4 | Small numbers |

### Typography Rules

1. **Financial numbers** always use `font-mono`
2. **Addresses** truncated with mono font: `0x1234...5678`
3. **Countdowns** use `display-2` with mono font
4. **Labels** use `body-sm` with `text-secondary`
5. **Never use more than 3 font sizes per card**

---

## 2.3 Spacing System

Base unit: **4px**

```
--space-1:   4px     // Minimal gaps
--space-2:   8px     // Icon gaps, tight padding
--space-3:   12px    // Default inline spacing
--space-4:   16px    // Card padding, section gaps
--space-5:   20px    // Comfortable padding
--space-6:   24px    // Section separation
--space-8:   32px    // Large section gaps
--space-10:  40px    // Page section separation
--space-12:  48px    // Major layout gaps
--space-16:  64px    // Hero spacing
```

### Spacing Rules

1. **Card internal padding:** `space-5` (20px)
2. **Card gap in grid:** `space-4` (16px)
3. **Section gap:** `space-8` (32px)
4. **Page padding:** `space-6` horizontal, `space-8` vertical
5. **Sidebar width:** 240px fixed
6. **Max content width:** 1200px

---

## 2.4 Grid System

### Layout Grid

```
Desktop (≥1280px):
  - Sidebar: 240px fixed
  - Main: fluid, max 1200px
  - Gutter: 24px

Tablet (768px - 1279px):
  - Sidebar: collapsed to 64px (icons only)
  - Main: fluid
  - Gutter: 16px

Mobile (<768px):
  - Sidebar: hidden (hamburger menu)
  - Main: full width
  - Gutter: 16px
```

### Content Grid

```
12-column grid within main content area
Column gap: 16px
Responsive breakpoints:
  - 4 columns on mobile
  - 8 columns on tablet  
  - 12 columns on desktop
```

---

## 2.5 Card Philosophy

### Card Anatomy

```
┌─────────────────────────────────────┐
│  [Icon]  Title            [Badge]  │  ← Header (optional)
├─────────────────────────────────────┤
│                                     │
│         Primary Content             │  ← Body
│         (metrics, forms, etc)       │
│                                     │
├─────────────────────────────────────┤
│  [Secondary Action]  [Primary CTA]  │  ← Footer (optional)
└─────────────────────────────────────┘
```

### Card Variants

| Variant | Background | Border | Shadow | Use Case |
|---------|------------|--------|--------|----------|
| `default` | `--bg-surface` | none | subtle | Most cards |
| `elevated` | `--bg-elevated` | none | medium | Modals, dropdowns |
| `outlined` | transparent | `--border-subtle` | none | Secondary info |
| `highlighted` | accent gradient bg | none | glow | Featured metrics |
| `danger` | `--status-danger-bg` | `--status-danger` | none | Warnings |

### Card Rules

1. **No nested cards** — flat hierarchy
2. **One primary action per card maximum**
3. **Cards never touch** — minimum gap `space-4`
4. **Content determines height** — no fixed heights
5. **Border radius:** 12px consistently

---

## 2.6 Button System

### Button Hierarchy

| Variant | Background | Text | Use Case |
|---------|------------|------|----------|
| `primary` | `--gradient-primary` | white | Main actions (Buy, Vote) |
| `secondary` | `--bg-elevated` | `--text-primary` | Secondary actions |
| `ghost` | transparent | `--text-secondary` | Tertiary, navigation |
| `danger` | `--gradient-danger` | white | Destructive actions |
| `success` | `--status-success` | white | Confirm positive action |

### Button Sizes

| Size | Height | Padding | Font |
|------|--------|---------|------|
| `sm` | 32px | 12px 16px | `body-sm` |
| `md` | 40px | 12px 20px | `body-md` |
| `lg` | 48px | 16px 24px | `body-lg` |
| `xl` | 56px | 16px 32px | `heading-3` |

### Button States

```
:default    → base styles
:hover      → brightness(1.1) + slight translateY(-1px)
:active     → brightness(0.95) + translateY(0)
:disabled   → opacity(0.5) + cursor: not-allowed
:loading    → spinner replaces text, disabled interaction
```

### Button Rules

1. **Only one `primary` button visible per viewport**
2. **Destructive buttons require confirmation modal**
3. **Loading state shows spinner + "Processing..."**
4. **Icon buttons are 40x40 with centered icon**

---

## 2.7 Form Elements

### Input Fields

```
┌─────────────────────────────────────┐
│  Label                              │
│  ┌─────────────────────────────┐   │
│  │ Placeholder or value        │   │
│  └─────────────────────────────┘   │
│  Helper text or error              │
└─────────────────────────────────────┘

Height: 44px
Border-radius: 8px
Background: --bg-elevated
Border: 1px solid --border-subtle
Focus: border-color --accent-primary
Error: border-color --status-danger
```

### Number Input (Financial)

```
┌─────────────────────────────────────┐
│  Amount                             │
│  ┌─────────────────────────────┐   │
│  │ [-]  1,000.00         LUSD  │   │
│  └─────────────────────────────┘   │
│  Balance: 5,000.00 LUSD  [MAX]     │
└─────────────────────────────────────┘

Font: mono-lg for value
Quick select buttons below: [10] [50] [100] [MAX]
```

---

## 2.8 Status Indicators

### Badge Variants

| Type | Background | Text | Dot |
|------|------------|------|-----|
| `success` | `--status-success-bg` | `--status-success` | ● |
| `warning` | `--status-warning-bg` | `--status-warning` | ● |
| `danger` | `--status-danger-bg` | `--status-danger` | ● |
| `info` | `--status-info-bg` | `--status-info` | ● |
| `neutral` | `--status-neutral-bg` | `--status-neutral` | ○ |

### Progress Indicators

**Linear Progress (Cap Progress)**
```
┌────────────────────────────────────────────┐
│ ████████████████████░░░░░░░░░░░░░░░░░░░░░ │
│           67.3%                            │
└────────────────────────────────────────────┘

Height: 8px
Border-radius: 4px
Background: --bg-hover
Fill: --gradient-primary
Animated fill transition: 0.5s ease
```

**Countdown Timer**
```
┌─────────────────┐
│   23:45:12      │  ← mono-lg, --text-primary
│   remaining     │  ← body-sm, --text-secondary
└─────────────────┘

When < 1 hour: text becomes --status-warning
When < 10 min: text becomes --status-danger + pulse animation
```

---

## 2.9 Loading & Skeleton States

### Skeleton Pattern

```
Background: linear-gradient(
  90deg,
  --bg-elevated 0%,
  --bg-hover 50%,
  --bg-elevated 100%
)
Animation: shimmer 1.5s infinite
Border-radius: matches content shape
```

### Loading States

| Context | Behavior |
|---------|----------|
| Page load | Full skeleton of expected layout |
| Card refresh | Subtle opacity pulse (0.7 → 1) |
| Button pending | Spinner + disabled state |
| Transaction pending | Progress modal with steps |

### Transaction Pending Modal

```
┌─────────────────────────────────────────────┐
│                                             │
│            [Spinner Animation]              │
│                                             │
│         Waiting for confirmation            │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ ✓ Approval submitted                │   │
│  │ ◐ Waiting for confirmation...       │   │
│  │ ○ Transaction complete              │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [View on Arbiscan]                        │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 2.10 Empty States

### Pattern

```
┌─────────────────────────────────────────────┐
│                                             │
│            [Illustration/Icon]              │
│               (64x64, muted)                │
│                                             │
│          No participants yet                │
│                                             │
│    Be the first to join this round         │
│                                             │
│           [Buy Shares →]                    │
│                                             │
└─────────────────────────────────────────────┘
```

### Empty State Rules

1. Always provide context (why empty)
2. Always provide action (what to do)
3. Icon/illustration is subtle, not decorative
4. Text is concise, action-oriented

---

## 2.11 Error States

### Inline Errors

```
Input border: --status-danger
Below input: "Insufficient balance" in --status-danger, body-sm
Icon: ⚠ before message
```

### Toast Notifications

```
Position: top-right, 24px from edges
Width: 360px max
Auto-dismiss: 5s for success, manual for errors

Types:
  - Success: green left border + checkmark
  - Error: red left border + X icon
  - Warning: amber left border + warning icon
  - Info: blue left border + info icon
```

### Full-Page Errors

```
Centered card with:
  - Error icon (large, muted red)
  - Error title
  - Technical details (collapsible)
  - [Retry] [Go Home] buttons
```

---

# PART 3: INFORMATION ARCHITECTURE

## 3.1 Global Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER                                                          │
│ [Logo]              [Network Badge]  [Wallet: 0x1234...5678 ▼] │
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                      │
│ SIDEBAR  │                 MAIN CONTENT                         │
│          │                                                      │
│ ● Home   │  ┌─────────────────────────────────────────────┐    │
│ ○ Buy    │  │                                             │    │
│ ○ Vote   │  │                                             │    │
│ ○ Stats  │  │                                             │    │
│ ○ History│  │                                             │    │
│          │  │                                             │    │
│ ──────── │  │                                             │    │
│ ○ Admin  │  │                                             │    │
│          │  │                                             │    │
│          │  └─────────────────────────────────────────────┘    │
│          │                                                      │
│ ──────── │                                                      │
│ [?] Help │                                                      │
│ [⚙] Set  │                                                      │
└──────────┴──────────────────────────────────────────────────────┘
```

### Header Specification

**Height:** 64px  
**Background:** `--bg-surface`  
**Border-bottom:** 1px solid `--border-subtle`

**Contents (left to right):**
1. **Logo** — Participation Game wordmark, links to home
2. **Spacer** — flex grow
3. **Game Status Badge** — Shows current game state with appropriate color
4. **Network Badge** — "Arbitrum" with green dot if correct, red warning if wrong
5. **Wallet Button** — Connected address truncated, dropdown with disconnect

**Wallet Dropdown:**
```
┌─────────────────────────────┐
│ Connected                   │
│ 0x1234...5678         [📋] │
├─────────────────────────────┤
│ Balance: 1,234.56 LUSD     │
├─────────────────────────────┤
│ [Disconnect]               │
└─────────────────────────────┘
```

### Sidebar Specification

**Width:** 240px (desktop), 64px (tablet), hidden (mobile)  
**Background:** `--bg-root`  
**Border-right:** 1px solid `--border-subtle`

**Navigation Items:**
```
Each item:
  Height: 44px
  Padding: 12px 16px
  Border-radius: 8px
  Gap between icon and label: 12px

States:
  :default  → text-secondary, no background
  :hover    → text-primary, bg-hover
  :active   → text-primary, accent-primary-muted bg, accent border-left
```

**Navigation Structure:**
```
MAIN
  ● Home (Dashboard icon)
  ○ Buy Shares (Plus-circle icon)
  ○ Voting (Vote icon)
  ○ My Stats (User icon)
  ○ Winners (Trophy icon)

ADMIN (only if isOperator || isOwner)
  ○ Control Panel (Settings icon)

FOOTER
  ○ How It Works (Help-circle icon)
  ○ Settings (Gear icon)
```

---

## 3.2 Page Structure: HOME

**Purpose:** Live game overview — the command center

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│ GAME #42                                        Status: BUYING  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────┐ ┌─────────────────────────┐│
│ │      PRIZE POOL                 │ │      YOUR POSITION      ││
│ │                                 │ │                         ││
│ │      12,670.90                  │ │   Shares: 150           ││
│ │          LUSD                   │ │   Value: 150 LUSD       ││
│ │                                 │ │   Status: Active ●      ││
│ │  ████████████████░░░░░░ 78.4%   │ │                         ││
│ │  Cap: 10,000 LUSD               │ │   [Buy More →]          ││
│ └─────────────────────────────────┘ └─────────────────────────┘│
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐  │
│ │  GAME PROGRESS                                            │  │
│ │                                                           │  │
│ │  ●━━━━━━━●━━━━━━━○━━━━━━━○━━━━━━━○━━━━━━━○━━━━━━━○━━━━━━━○ │  │
│ │  Buy    Cap     VRF    Elim    Vote8   Vote4   Vote2   End│  │
│ │         ▲                                                 │  │
│ │      Current                                              │  │
│ └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│ ┌──────────────────────┐ ┌──────────────────────┐              │
│ │ PARTICIPANTS         │ │ RECENT ACTIVITY      │              │
│ │                      │ │                      │              │
│ │ Total: 247           │ │ 0x89ab... +50 shares │              │
│ │ Unique wallets: 89   │ │ 0x45cd... +10 shares │              │
│ │                      │ │ 0x12ef... +25 shares │              │
│ │                      │ │ ...                  │              │
│ └──────────────────────┘ └──────────────────────┘              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### State-Based Transformations

**State: BUYING**
- Prize Pool card shows progress bar
- "Buy More" CTA prominent
- Activity feed shows purchases

**State: CAP_REACHED**
- Progress bar at 100%, pulsing
- Badge: "Waiting for VRF" (amber)
- No purchase CTA
- Show "Randomness will be requested soon"

**State: VRF_REQUEST**
- Spinner animation in progress section
- "Requesting randomness from Chainlink..."
- Estimated time shown

**State: ELIMINATING**
- Animation: shuffling participants
- "Selecting 8 finalists..."
- Dramatic reveal moment

**State: VOTING (8/4/2)**
- Prize Pool card replaced with VOTING card
- Countdown timer prominent
- Vote tallies visible
- User's vote status shown
- [See Voting Page for full spec]

**State: FINISHED**
- Winner announcement (highlighted card)
- Prize amount displayed large
- Confetti animation (subtle)
- "New game starting soon..."

---

## 3.3 Page Structure: BUY SHARES

**Purpose:** Focused share purchase experience

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│ BUY SHARES                                     Game #42 ● BUYING│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │                                                             ││
│ │  ┌─────────────────────────────────────────────────────┐   ││
│ │  │                                                     │   ││
│ │  │  Amount                                             │   ││
│ │  │  ┌─────────────────────────────────────────────┐   │   ││
│ │  │  │  [-]         100              [+]    LUSD   │   │   ││
│ │  │  └─────────────────────────────────────────────┘   │   ││
│ │  │                                                     │   ││
│ │  │  [10]   [25]   [50]   [100]   [MAX]                │   ││
│ │  │                                                     │   ││
│ │  │  ───────────────────────────────────────────────   │   ││
│ │  │                                                     │   ││
│ │  │  Summary                                            │   ││
│ │  │  ┌─────────────────────────────────────────────┐   │   ││
│ │  │  │ Shares to receive       100                 │   │   ││
│ │  │  │ Platform fee (10%)      10 LUSD             │   │   ││
│ │  │  │ Added to prize pool     90 LUSD             │   │   ││
│ │  │  └─────────────────────────────────────────────┘   │   ││
│ │  │                                                     │   ││
│ │  │  Your balance: 1,234.56 LUSD                       │   ││
│ │  │                                                     │   ││
│ │  │  ┌─────────────────────────────────────────────┐   │   ││
│ │  │  │           Approve LUSD                      │   │   ││
│ │  │  └─────────────────────────────────────────────┘   │   ││
│ │  │                                                     │   ││
│ │  │  OR (if already approved)                          │   ││
│ │  │                                                     │   ││
│ │  │  ┌─────────────────────────────────────────────┐   │   ││
│ │  │  │           Buy 100 Shares                    │   │   ││
│ │  │  └─────────────────────────────────────────────┘   │   ││
│ │  │                                                     │   ││
│ │  └─────────────────────────────────────────────────────┘   ││
│ │                                                             ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌──────────────────────┐ ┌──────────────────────────────────┐  │
│ │ CURRENT GAME         │ │ INFO                             │  │
│ │                      │ │                                  │  │
│ │ Prize Pool: 7,840    │ │ • 1 LUSD = 1 share               │  │
│ │ Cap: 10,000          │ │ • More shares = higher chance    │  │
│ │ Remaining: 2,160     │ │ • 85% goes to final winner       │  │
│ │ Participants: 89     │ │ • Excess rolls to next game      │  │
│ └──────────────────────┘ └──────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Approval Flow States

**State 1: Needs Approval**
```
Button: "Approve LUSD" (primary)
Helper: "You need to approve the contract to spend your LUSD"
```

**State 2: Approving**
```
Button: [Spinner] "Approving..." (disabled)
Helper: "Waiting for confirmation..."
```

**State 3: Approved, Ready to Buy**
```
Button: "Buy [X] Shares" (primary)
Helper: "✓ LUSD approved"
```

**State 4: Buying**
```
Button: [Spinner] "Processing..." (disabled)
Transaction modal appears
```

**State 5: Success**
```
Toast: "Successfully purchased 100 shares!"
Redirect to Home after 2s
```

### Error States

**Insufficient Balance:**
```
Button: "Insufficient Balance" (disabled, danger variant)
Helper: "You need X more LUSD"
```

**Wrong Network:**
```
Full card overlay:
"Please switch to Arbitrum network"
[Switch Network] button
```

**Game Not in Buying State:**
```
Full card overlay:
"Purchases are closed for this round"
"Game is currently in [STATE]"
[View Game →]
```

---

## 3.4 Page Structure: VOTING

**Purpose:** High-stakes voting experience during elimination rounds

**Layout (when user IS an active participant):**
```
┌─────────────────────────────────────────────────────────────────┐
│ VOTING ROUND                                   Game #42 ● VOTE8 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │                    TIME REMAINING                           ││
│ │                                                             ││
│ │                      23:45:12                               ││
│ │                                                             ││
│ │               ████████████░░░░░░░░░░░                       ││
│ │                                                             ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌────────────────────────────┐ ┌────────────────────────────┐  │
│ │                            │ │                            │  │
│ │   CONTINUE                 │ │   STOP                     │  │
│ │                            │ │                            │  │
│ │   Eliminate half and       │ │   End the game now and     │  │
│ │   continue to next round   │ │   select winner randomly   │  │
│ │                            │ │                            │  │
│ │        5 votes             │ │        3 votes             │  │
│ │   ████████████░░░░░░░░     │ │   ████████░░░░░░░░░░░░░░   │  │
│ │                            │ │                            │  │
│ │   ┌────────────────────┐   │ │   ┌────────────────────┐   │  │
│ │   │  Vote CONTINUE     │   │ │   │  Vote STOP         │   │  │
│ │   └────────────────────┘   │ │   └────────────────────┘   │  │
│ │                            │ │                            │  │
│ └────────────────────────────┘ └────────────────────────────┘  │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ ACTIVE PARTICIPANTS (8)                                     ││
│ │                                                             ││
│ │  0x1234...5678 ●    0x89ab...cdef ●    0x4567...89ab ○     ││
│ │  0xfedc...ba98 ●    0x2345...6789 ○    0xabcd...ef01 ●     ││
│ │  0x7890...1234 ○    0x3456...7890 ○                        ││
│ │                                                             ││
│ │  ● Voted   ○ Not yet voted   ★ You                         ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Voting Button States

**Can Vote:**
```
"Vote CONTINUE" - primary green button
"Vote STOP" - outlined red button
```

**Already Voted:**
```
Both buttons disabled
Selected button shows checkmark: "✓ You voted CONTINUE"
Other button grayed out
```

**Not a Participant:**
```
Both buttons hidden
Message: "You are not an active participant in this round"
"Watch the results below"
```

### Time Sensitivity

**> 1 hour remaining:**
- Normal colors
- No urgency indicators

**< 1 hour remaining:**
- Timer turns amber
- Subtle pulse on timer

**< 10 minutes remaining:**
- Timer turns red
- Strong pulse animation
- "Hurry! Voting ends soon"

**Deadline passed:**
- "Voting has ended"
- "Waiting for results..."
- Buttons disabled

---

## 3.5 Page Structure: MY STATS (User Dashboard)

**Purpose:** Personal participation overview

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│ MY STATS                                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────┐│
│ │ TOTAL SHARES │ │ GAMES PLAYED │ │ WINS         │ │ EARNINGS ││
│ │              │ │              │ │              │ │          ││
│ │     450      │ │      7       │ │      1       │ │  850.00  ││
│ │              │ │              │ │              │ │   LUSD   ││
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────┘│
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ CURRENT GAME                                                ││
│ │                                                             ││
│ │  Game #42 • VOTING8                                         ││
│ │                                                             ││
│ │  Your shares: 150                                           ││
│ │  Status: Active Participant ●                               ││
│ │  Vote status: Voted CONTINUE ✓                              ││
│ │                                                             ││
│ │  [Go to Voting →]                                           ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ PARTICIPATION HISTORY                                       ││
│ │                                                             ││
│ │  Game   Shares   Result          Prize                      ││
│ │  ─────────────────────────────────────────────────────      ││
│ │  #42    150      In progress     -                          ││
│ │  #41    100      Eliminated R2   -                          ││
│ │  #40    200      🏆 WINNER       850.00 LUSD               ││
│ │  #39    50       Not selected    -                          ││
│ │  #38    100      Eliminated R1   -                          ││
│ │                                                             ││
│ │  [Load More]                                                ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Metric Cards

Each top-level metric uses the "highlighted" card variant for the primary metric (Total Shares or Earnings), standard cards for others.

---

## 3.6 Page Structure: WINNERS

**Purpose:** Historical results and transparency

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│ WINNERS                                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ LATEST WINNER                                     Game #41  ││
│ │                                                             ││
│ │                    🏆                                       ││
│ │                                                             ││
│ │              0x89ab...cdef                                  ││
│ │                                                             ││
│ │              Won 8,500.00 LUSD                              ││
│ │                                                             ││
│ │    [View on Arbiscan →]                                     ││
│ │                                                             ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ ALL GAMES                                                   ││
│ │                                                             ││
│ │  #    Winner          Prize         Duration   Participants ││
│ │  ───────────────────────────────────────────────────────── ││
│ │  41   0x89ab...cdef   8,500 LUSD    5d 4h      124          ││
│ │  40   0x1234...5678   7,200 LUSD    6d 12h     98           ││
│ │  39   0xfedc...ba98   9,100 LUSD    4d 8h      156          ││
│ │  38   0x4567...89ab   6,800 LUSD    8d 2h      87           ││
│ │  ...                                                        ││
│ │                                                             ││
│ │  [Load More]                                                ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌──────────────────────┐ ┌──────────────────────────────────┐  │
│ │ TOTAL DISTRIBUTED    │ │ AVERAGE PRIZE                    │  │
│ │                      │ │                                  │  │
│ │   125,400 LUSD       │ │   7,850 LUSD                     │  │
│ └──────────────────────┘ └──────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3.7 Page Structure: ADMIN / OPERATOR PANEL

**Purpose:** Game control and operations

**Access:** Only visible to `isOwner` or `isOperator` addresses

**Visual Differentiation:**
- Sidebar item has shield icon
- Page header has "ADMIN" badge in amber
- Slightly different accent color (amber instead of green)

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│ ADMIN CONTROL PANEL                              🛡 ADMIN MODE  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────┐│
│ │ GAME STATUS  │ │ PRIZE POOL   │ │ PARTICIPANTS │ │ CONTRACT ││
│ │              │ │              │ │              │ │          ││
│ │   VOTING8    │ │  8,500 LUSD  │ │     124      │ │  Active  ││
│ │              │ │              │ │              │ │          ││
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────┘│
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ GAME ACTIONS                                                ││
│ │                                                             ││
│ │  Current State: VOTING8                                     ││
│ │  Voting Deadline: 2025-12-13 14:30:00                       ││
│ │                                                             ││
│ │  Available Actions:                                         ││
│ │                                                             ││
│ │  ┌─────────────────────────────────────────────────────┐   ││
│ │  │ ⚡ Process Voting Results                           │   ││
│ │  │                                                     │   ││
│ │  │ Tallies votes and advances to next stage.          │   ││
│ │  │ Available after voting deadline passes.            │   ││
│ │  │                                                     │   ││
│ │  │ Status: Deadline not reached (4h 23m remaining)    │   ││
│ │  │                                                     │   ││
│ │  │ [Process Voting]  (disabled)                       │   ││
│ │  └─────────────────────────────────────────────────────┘   ││
│ │                                                             ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ EMERGENCY CONTROLS                              ⚠ DANGER   ││
│ │                                                             ││
│ │  Contract Status: ● Active                                  ││
│ │                                                             ││
│ │  [🔴 Pause Contract]                                        ││
│ │                                                             ││
│ │  Pausing will prevent all user actions.                     ││
│ │  Only use in emergency situations.                          ││
│ │                                                             ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Admin Action Cards

Each action has its own card with:
1. **Icon** — Visual indicator of action type
2. **Title** — Action name
3. **Description** — What this action does
4. **Prerequisites** — What conditions must be met
5. **Status** — Current eligibility
6. **Button** — Execute action (disabled if not eligible)

### Confirmation Modals (Admin)

All admin actions require confirmation:

```
┌─────────────────────────────────────────────┐
│ ⚠ Confirm Action                            │
├─────────────────────────────────────────────┤
│                                             │
│ You are about to:                           │
│                                             │
│ PAUSE THE CONTRACT                          │
│                                             │
│ This will:                                  │
│ • Prevent all share purchases               │
│ • Prevent all voting                        │
│ • NOT affect existing funds                 │
│                                             │
│ This action can be reversed by unpausing.   │
│                                             │
│ Type "PAUSE" to confirm:                    │
│ ┌─────────────────────────────────────┐    │
│ │                                     │    │
│ └─────────────────────────────────────┘    │
│                                             │
│        [Cancel]    [Confirm Pause]          │
│                                             │
└─────────────────────────────────────────────┘
```

---

# PART 4: COMPONENT SPECIFICATIONS

## 4.1 Wallet Connection

### Not Connected State

```
Header shows:
[Connect Wallet] — primary button, prominent

Clicking opens RainbowKit modal (default styling acceptable, 
but override colors to match our palette)
```

### Connected State

```
Header shows:
[🟢 Arbitrum] [0x1234...5678 ▼]

Network badge:
  - Green dot if correct network
  - Red dot + "Wrong Network" if incorrect
  - Clicking incorrect opens network switch prompt
```

### Wrong Network Modal

```
┌─────────────────────────────────────────────┐
│ Wrong Network                               │
├─────────────────────────────────────────────┤
│                                             │
│ Please switch to Arbitrum to continue.      │
│                                             │
│ Current: Ethereum Mainnet                   │
│ Required: Arbitrum One                      │
│                                             │
│        [Switch to Arbitrum]                 │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 4.2 Game Status Badge

### Variants

| State | Color | Label |
|-------|-------|-------|
| BUYING | Green | "Buying Open" |
| CAP_REACHED | Amber | "Cap Reached" |
| VRF_REQUEST | Amber + spin | "Requesting VRF..." |
| ELIMINATING | Amber + spin | "Eliminating..." |
| VOTING8 | Blue | "Voting (8)" |
| VOTING4 | Blue | "Voting (4)" |
| VOTING2 | Blue + pulse | "Final Vote (2)" |
| FINISHED | Green | "Finished" |

### Design

```
Pill shape
Padding: 6px 12px
Font: body-sm, medium weight
Dot indicator before text
Border-radius: 9999px (full round)
```

---

## 4.3 Progress Bar (Cap)

### Structure

```
┌────────────────────────────────────────────┐
│ ████████████████████░░░░░░░░░░░░░░░░░░░░░ │
└────────────────────────────────────────────┘

Below bar:
Left: "7,840 / 10,000 LUSD"
Right: "78.4%"
```

### Animation

- Fill animates on load (0% → current%, 1s ease-out)
- On update, animate from previous to new value
- At 100%, show subtle pulse

---

## 4.4 Countdown Timer

### Large (Voting Page)

```
┌─────────────────┐
│   23:45:12      │  font: display-2, mono
└─────────────────┘
    remaining        font: body-sm

Format: HH:MM:SS
Updates every second
```

### Compact (Cards)

```
⏱ 23:45:12          font: mono-md
```

### Color Transitions

```
> 1 hour:   --text-primary
< 1 hour:   --status-warning
< 10 min:   --status-danger + animation: pulse 1s infinite
```

---

## 4.5 Participant List

### Active Participants (Voting)

```
Grid of address pills:

┌─────────────────┐
│ 0x1234...5678 ● │   ● = voted (green)
└─────────────────┘    ○ = not voted (gray)
                       ★ = you (gold border)
```

### All Participants (Stats)

```
Scrollable list with:
- Address (truncated)
- Shares count
- Participation date
```

---

## 4.6 Vote Buttons

### Design

Two cards side by side, each containing:

```
┌────────────────────────────────────┐
│                                    │
│   [Icon: ThumbsUp / ThumbsDown]    │
│                                    │
│   CONTINUE / STOP                  │   heading-2
│                                    │
│   Description text                 │   body-sm, secondary
│                                    │
│   ██████████░░░░░░  X votes        │   progress + count
│                                    │
│   ┌────────────────────────────┐   │
│   │      Vote [Option]         │   │   button
│   └────────────────────────────┘   │
│                                    │
└────────────────────────────────────┘
```

### States

**Can vote:** Buttons active, cards have hover effect
**Already voted:** Selected card highlighted, other dimmed
**Not participant:** Both cards visible but no buttons

---

# PART 5: UX RATIONALE

## 5.1 Why Sidebar Navigation?

**Decision:** Fixed sidebar navigation (not top nav)

**Rationale:**
1. Complex application with multiple distinct sections
2. Users need persistent awareness of where they are
3. Vertical nav scales better with more items
4. Keeps header focused on wallet/status
5. Reference image uses sidebar — maintains visual consistency

---

## 5.2 Why Separate Buy Page?

**Decision:** Dedicated page for purchasing instead of modal

**Rationale:**
1. Financial transaction deserves full focus
2. Approval flow has multiple states
3. Room for educational content
4. Reduces accidental purchases
5. Better mobile experience

---

## 5.3 Why Two-Column Vote Cards?

**Decision:** Side-by-side vote options instead of vertical list

**Rationale:**
1. Equal visual weight — no bias
2. Easy comparison
3. Natural binary choice representation
4. Progress bars align for quick comparison
5. Works on both desktop and tablet

---

## 5.4 Why Confirmation for Admin Actions?

**Decision:** Type-to-confirm for destructive admin actions

**Rationale:**
1. Prevents accidental clicks
2. Forces deliberate action
3. Creates paper trail of intent
4. Industry standard for dangerous operations
5. Builds trust in system safety

---

## 5.5 Why No Charts on Main Dashboard?

**Decision:** Metrics over charts for primary view

**Rationale:**
1. Game is discrete events, not continuous data
2. Key metrics are simple numbers
3. Charts would be decorative, not functional
4. Reduces visual noise
5. Reference image's charts don't apply to our data model

---

# PART 6: DEVELOPER NOTES

## 6.1 Technology Stack

```
Framework:     Next.js 16 (App Router)
Styling:       Tailwind CSS 3.4+
Components:    Custom (no Radix/Shadcn — fresh start)
Animations:    Framer Motion
Icons:         Lucide React
Web3:          wagmi v2, viem, RainbowKit
State:         Zustand (minimal)
Data:          TanStack Query
```

## 6.2 File Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home (redirects to /dashboard)
│   ├── buy/page.tsx
│   ├── vote/page.tsx
│   ├── stats/page.tsx
│   ├── winners/page.tsx
│   ├── admin/page.tsx
│   └── how-it-works/page.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── MainLayout.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Progress.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Skeleton.tsx
│   │   └── Toast.tsx
│   ├── game/
│   │   ├── GameStatusBadge.tsx
│   │   ├── PrizePoolCard.tsx
│   │   ├── CapProgress.tsx
│   │   ├── GameTimeline.tsx
│   │   ├── ParticipantList.tsx
│   │   └── ActivityFeed.tsx
│   ├── buy/
│   │   ├── AmountInput.tsx
│   │   ├── PurchaseSummary.tsx
│   │   └── ApprovalFlow.tsx
│   ├── vote/
│   │   ├── CountdownTimer.tsx
│   │   ├── VoteCard.tsx
│   │   ├── VoteTally.tsx
│   │   └── VoterList.tsx
│   ├── wallet/
│   │   ├── ConnectButton.tsx
│   │   ├── NetworkBadge.tsx
│   │   └── WalletDropdown.tsx
│   └── admin/
│       ├── ActionCard.tsx
│       ├── ConfirmationModal.tsx
│       └── EmergencyControls.tsx
├── hooks/
│   ├── useContractData.ts
│   ├── useGameStatus.ts
│   ├── useCountdown.ts
│   └── useApproval.ts
├── lib/
│   ├── utils.ts
│   ├── formatters.ts
│   └── constants.ts
├── config/
│   ├── contracts.ts
│   └── wagmi.ts
└── styles/
    └── globals.css          # Tailwind + CSS variables
```

## 6.3 Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: {
          root: '#07090C',
          surface: '#0D1117',
          elevated: '#161B22',
          hover: '#1C2128',
        },
        border: {
          subtle: '#21262D',
          default: '#30363D',
        },
        text: {
          primary: '#F0F6FC',
          secondary: '#8B949E',
          tertiary: '#484F58',
        },
        accent: {
          primary: '#10B981',
          secondary: '#3B82F6',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
}
```

## 6.4 Key Implementation Notes

1. **Game Status Hook** must poll every 10 seconds or subscribe to events
2. **Countdown Timer** uses `requestAnimationFrame` for smooth updates
3. **Transaction Flow** uses wagmi's `useWriteContract` with proper state handling
4. **Skeleton Loading** should match exact layout to prevent shift
5. **Mobile Navigation** uses slide-out drawer pattern
6. **Toast System** uses portal to render above everything
7. **Admin Access** checked server-side and client-side

## 6.5 Animation Guidelines

```
Micro-interactions:
  - Button hover: 150ms ease
  - Card hover: 200ms ease
  - Focus rings: 150ms ease

Page transitions:
  - None (instant) — speed over polish

Data updates:
  - Number changes: 300ms with counter animation
  - Progress bars: 500ms ease-out
  - Status badges: 200ms fade

Emphasis:
  - Countdown pulse: 1s infinite when critical
  - Winner reveal: 500ms scale-up + fade
  - Vote confirmation: 200ms checkmark draw
```

---

# PART 7: SUMMARY

This specification defines a complete UI replacement for the Participation Game application. The design:

1. **Discards all previous UI decisions** and starts fresh
2. **Follows the visual DNA** of the reference image without copying it
3. **Prioritizes function over form** at every decision point
4. **Adapts to game state** with meaningful visual transformations
5. **Separates user and admin experiences** while maintaining consistency
6. **Provides complete specifications** for implementation

The result should be a professional, trustworthy, and engaging interface that serves the unique needs of a decentralized participation game.

---

**Document Status:** Ready for implementation  
**Next Step:** Component development in priority order (Layout → Wallet → Game Status → Buy Flow → Vote Flow → Admin)

---

*End of specification.*
