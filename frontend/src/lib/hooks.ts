'use client'

import { useReadContract, useAccount, useBlockNumber } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { PARTICIPATION_GAME_ABI, ERC20_ABI, GameStatus } from '@/config/contracts'

// Contract addresses - Arbitrum Sepolia Testnet
export const GAME_CONTRACT = (process.env.NEXT_PUBLIC_GAME_CONTRACT || '0xd98b85650Fa30d849217e540A563D26Eb21f8E46') as `0x${string}`
export const LUSD_CONTRACT = (process.env.NEXT_PUBLIC_LUSD_CONTRACT || '0x8d13F248f3D7be222FF5E9743E392C76948C1028') as `0x${string}`

export interface GameDetails {
  tokenCap: bigint
  totalRevenue: bigint
  prizePool: bigint
  platformFee: bigint
  eliminationRandomSeed: bigint
  startTime: bigint
  endTime: bigint
  votingDeadline: bigint
  status: number
}

export interface ParticipantInfo {
  shares: bigint
  prizeWithdrawalAddress: `0x${string}`
  defaultVote: boolean
  hasVotedInCurrentStage: boolean
}

export function useContractData() {
  const { address } = useAccount()
  const queryClient = useQueryClient()
  
  // Watch for new blocks to auto-refresh data
  const { data: blockNumber } = useBlockNumber({ watch: true })

  // Get current game ID
  const { data: currentGameId, queryKey: gameIdKey } = useReadContract({
    address: GAME_CONTRACT,
    abi: PARTICIPATION_GAME_ABI,
    functionName: 'currentGameId',
  })

  const gameId = currentGameId || 1n

  // Get game details
  const { data: gameDetails, isLoading: isLoadingDetails, queryKey: detailsKey } = useReadContract({
    address: GAME_CONTRACT,
    abi: PARTICIPATION_GAME_ABI,
    functionName: 'getGameDetails',
    args: [gameId],
  })

  // Get participant count (total participants who bought shares)
  const { data: participantCount, queryKey: countKey } = useReadContract({
    address: GAME_CONTRACT,
    abi: PARTICIPATION_GAME_ABI,
    functionName: 'getParticipantCount',
    args: [gameId],
  })

  // Get vote tallies
  const { data: voteTallies, queryKey: votesKey } = useReadContract({
    address: GAME_CONTRACT,
    abi: PARTICIPATION_GAME_ABI,
    functionName: 'getVoteTallies',
    args: [gameId],
  })

  // Get active participants (after elimination)
  const { data: activeParticipants, queryKey: activeKey } = useReadContract({
    address: GAME_CONTRACT,
    abi: PARTICIPATION_GAME_ABI,
    functionName: 'getActiveParticipants',
    args: [gameId],
  })

  // Get user participant info
  const { data: userParticipant, queryKey: userKey } = useReadContract({
    address: GAME_CONTRACT,
    abi: PARTICIPATION_GAME_ABI,
    functionName: 'getParticipant',
    args: address ? [gameId, address] : undefined,
  })

  // Get LUSD balance
  const { data: lusdBalance, queryKey: balanceKey } = useReadContract({
    address: LUSD_CONTRACT,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  // Get LUSD allowance
  const { data: lusdAllowance, queryKey: allowanceKey } = useReadContract({
    address: LUSD_CONTRACT,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, GAME_CONTRACT] : undefined,
  })

  // Get game winner
  const { data: gameWinner, queryKey: winnerKey } = useReadContract({
    address: GAME_CONTRACT,
    abi: PARTICIPATION_GAME_ABI,
    functionName: 'gameWinners',
    args: [gameId],
  })

  // Get total prize pool across all games
  const { data: totalPrizePoolAllGames } = useReadContract({
    address: GAME_CONTRACT,
    abi: PARTICIPATION_GAME_ABI,
    functionName: 'totalPrizePoolAllGames',
  })

  // Invalidate queries when block changes (auto-refresh)
  useEffect(() => {
    if (blockNumber) {
      queryClient.invalidateQueries({ queryKey: detailsKey })
      queryClient.invalidateQueries({ queryKey: countKey })
      queryClient.invalidateQueries({ queryKey: votesKey })
      queryClient.invalidateQueries({ queryKey: activeKey })
      if (address) {
        queryClient.invalidateQueries({ queryKey: userKey })
        queryClient.invalidateQueries({ queryKey: balanceKey })
        queryClient.invalidateQueries({ queryKey: allowanceKey })
      }
    }
  }, [blockNumber, queryClient, address])

  const typedGameDetails = gameDetails as GameDetails | undefined
  const typedUserParticipant = userParticipant as ParticipantInfo | undefined

  return {
    // Game info
    gameId,
    gameDetails: typedGameDetails,
    participantCount: participantCount ? Number(participantCount) : 0,
    activeParticipantCount: activeParticipants ? (activeParticipants as `0x${string}`[]).length : 0,
    voteTallies: voteTallies as [bigint, bigint] | undefined,
    activeParticipants: activeParticipants as `0x${string}`[] | undefined,
    gameWinner: gameWinner as `0x${string}` | undefined,
    totalPrizePoolAllGames: totalPrizePoolAllGames as bigint | undefined,
    
    // User info
    userParticipant: typedUserParticipant,
    userShares: typedUserParticipant?.shares || 0n,
    hasVoted: typedUserParticipant?.hasVotedInCurrentStage || false,
    isParticipant: (typedUserParticipant?.shares || 0n) > 0n,
    isActiveParticipant: activeParticipants 
      ? (activeParticipants as `0x${string}`[]).includes(address as `0x${string}`) 
      : false,
    
    // Token info
    lusdBalance: lusdBalance as bigint | undefined,
    lusdAllowance: lusdAllowance as bigint | undefined,
    
    // Loading state
    isLoading: isLoadingDetails,
    
    // Contract addresses
    contractAddress: GAME_CONTRACT,
    lusdAddress: LUSD_CONTRACT,
  }
}

export function useGameStatus() {
  const { gameDetails } = useContractData()
  
  const status = gameDetails?.status ?? GameStatus.Buying
  const statusName = [
    'Buying',
    'CapReached', 
    'VRF_Request',
    'Eliminating',
    'Voting8',
    'Voting4',
    'Voting2',
    'Finished'
  ][status] || 'Buying'

  return {
    status,
    statusName,
    isBuying: status === GameStatus.Buying,
    isCapReached: status === GameStatus.CapReached,
    isEliminating: status === GameStatus.Eliminating || status === GameStatus.VRF_Request,
    isVoting: status >= GameStatus.Voting8 && status <= GameStatus.Voting2,
    isFinished: status === GameStatus.Finished,
    votingStage: status === GameStatus.Voting8 ? 8 : status === GameStatus.Voting4 ? 4 : status === GameStatus.Voting2 ? 2 : 0,
  }
}
