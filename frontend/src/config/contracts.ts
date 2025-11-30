// Contract Configuration
// This file contains the ABI and addresses for the ParticipationGame contract

export const PARTICIPATION_GAME_ABI = [
  // ========== READ FUNCTIONS ==========
  {
    name: 'currentGameId',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'getGameDetails',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'gameId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'tokenCap', type: 'uint256' },
          { name: 'totalRevenue', type: 'uint256' },
          { name: 'prizePool', type: 'uint256' },
          { name: 'platformFee', type: 'uint256' },
          { name: 'eliminationRandomSeed', type: 'uint256' },
          { name: 'startTime', type: 'uint128' },
          { name: 'endTime', type: 'uint128' },
          { name: 'votingDeadline', type: 'uint128' },
          { name: 'status', type: 'uint8' },
        ],
      },
    ],
  },
  {
    name: 'getParticipant',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'gameId', type: 'uint256' },
      { name: 'user', type: 'address' },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'shares', type: 'uint256' },
          { name: 'prizeWithdrawalAddress', type: 'address' },
          { name: 'defaultVote', type: 'bool' },
          { name: 'hasVotedInCurrentStage', type: 'bool' },
        ],
      },
    ],
  },
  {
    name: 'getParticipantCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'gameId', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'getActiveParticipants',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'gameId', type: 'uint256' }],
    outputs: [{ name: '', type: 'address[]' }],
  },
  {
    name: 'getVoteTallies',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'gameId', type: 'uint256' }],
    outputs: [
      { name: 'continueVotes', type: 'uint256' },
      { name: 'endVotes', type: 'uint256' },
    ],
  },
  {
    name: 'getConsolationPrizePool',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'gameId', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'getFinalPrizePool',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'gameId', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'gameWinners',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'gameId', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    name: 'lusdToken',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    name: 'platformFeeWallet',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    name: 'isOperator',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'operator', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'owner',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    name: 'paused',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'totalPrizePoolAllGames',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },

  // ========== WRITE FUNCTIONS ==========
  {
    name: 'buyShares',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'optionalPrizeAddress', type: 'address' },
    ],
    outputs: [],
  },
  {
    name: 'submitVote',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'gameId', type: 'uint256' },
      { name: 'decision', type: 'bool' },
    ],
    outputs: [],
  },

  // ========== OPERATOR FUNCTIONS ==========
  {
    name: 'requestRandomWords',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'gameId', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'processVotingResults',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'gameId', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'distributeConsolationPrizes',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'winners', type: 'address[]' },
      { name: 'amounts', type: 'uint256[]' },
      { name: 'batchSize', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'distributeFinalPrize',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'gameId', type: 'uint256' }],
    outputs: [],
  },

  // ========== ADMIN FUNCTIONS ==========
  {
    name: 'setOperator',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'operator', type: 'address' },
      { name: 'isAuthorized', type: 'bool' },
    ],
    outputs: [],
  },
  {
    name: 'pauseGame',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    name: 'unpauseGame',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    name: 'setPlatformFeeWallet',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'newWallet', type: 'address' }],
    outputs: [],
  },

  // ========== EVENTS ==========
  {
    name: 'SharesPurchased',
    type: 'event',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'gameId', type: 'uint256', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'rolloverAmount', type: 'uint256', indexed: false },
    ],
  },
  {
    name: 'GameStatusChanged',
    type: 'event',
    inputs: [
      { name: 'gameId', type: 'uint256', indexed: true },
      { name: 'oldStatus', type: 'uint8', indexed: false },
      { name: 'newStatus', type: 'uint8', indexed: false },
    ],
  },
  {
    name: 'VoteCast',
    type: 'event',
    inputs: [
      { name: 'voter', type: 'address', indexed: true },
      { name: 'gameId', type: 'uint256', indexed: true },
      { name: 'decision', type: 'bool', indexed: false },
      { name: 'stage', type: 'uint8', indexed: false },
    ],
  },
  {
    name: 'PrizeDistributed',
    type: 'event',
    inputs: [
      { name: 'winner', type: 'address', indexed: true },
      { name: 'gameId', type: 'uint256', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'prizeType', type: 'string', indexed: false },
    ],
  },
  {
    name: 'GameCreated',
    type: 'event',
    inputs: [
      { name: 'gameId', type: 'uint256', indexed: true },
      { name: 'tokenCap', type: 'uint256', indexed: false },
    ],
  },
] as const

// ERC20 ABI for LUSD token
export const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const

// Game Status Enum (matches Solidity)
export enum GameStatus {
  Buying = 0,
  CapReached = 1,
  VRF_Request = 2,
  Eliminating = 3,
  Voting8 = 4,
  Voting4 = 5,
  Voting2 = 6,
  Finished = 7,
}

export const GAME_STATUS_NAMES = [
  'Buying',
  'CapReached',
  'VRF_Request',
  'Eliminating',
  'Voting8',
  'Voting4',
  'Voting2',
  'Finished',
] as const
