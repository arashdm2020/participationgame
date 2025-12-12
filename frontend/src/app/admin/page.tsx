'use client'

import { PanelLayout } from '@/components/layout/PanelLayout'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { PARTICIPATION_GAME_ABI, GameStatus, GAME_STATUS_NAMES } from '@/config/contracts'
import { formatEther } from 'viem'
import { useContractData, useGameStatus } from '@/lib/hooks'
import { useQueryClient } from '@tanstack/react-query'
import {
  Shield,
  Users,
  TrendingUp,
  Coins,
  Play,
  Pause,
  Zap,
  Vote,
  Gift,
  AlertTriangle,
  Loader2,
  Wallet,
} from 'lucide-react'

export default function AdminPage() {
  const { address, isConnected } = useAccount()
  const queryClient = useQueryClient()
  const { 
    contractAddress, 
    gameId, 
    gameDetails, 
    participantCount,
    totalPrizePoolAllGames 
  } = useContractData()
  const { status, statusName } = useGameStatus()

  const { data: owner } = useReadContract({
    address: contractAddress,
    abi: PARTICIPATION_GAME_ABI,
    functionName: 'owner',
  })

  const { data: isOperator } = useReadContract({
    address: contractAddress,
    abi: PARTICIPATION_GAME_ABI,
    functionName: 'isOperator',
    args: address ? [address] : undefined,
  })

  const { data: isPaused } = useReadContract({
    address: contractAddress,
    abi: PARTICIPATION_GAME_ABI,
    functionName: 'paused',
  })

  const { writeContract: requestVRF, isPending: isRequestingVRF } = useWriteContract()
  const { writeContract: processVoting, isPending: isProcessingVoting } = useWriteContract()
  const { writeContract: distributeFinalPrize, isPending: isDistributing } = useWriteContract()
  const { writeContract: pauseGame, isPending: isPausing } = useWriteContract()
  const { writeContract: unpauseGame, isPending: isUnpausing } = useWriteContract()

  const isOwner = address?.toLowerCase() === (owner as string)?.toLowerCase()
  const hasAccess = isOwner || isOperator

  const prizePool = gameDetails?.prizePool || 0n
  const tokenCap = gameDetails?.tokenCap || 0n
  const totalRevenue = gameDetails?.totalRevenue || 0n
  
  const prizePoolFormatted = Number(formatEther(prizePool)).toLocaleString()
  const totalDistributed = totalPrizePoolAllGames 
    ? Number(formatEther(totalPrizePoolAllGames)).toLocaleString()
    : '0'
  const progress = tokenCap > 0n ? Number((totalRevenue * 100n) / tokenCap) : 0

  const handleRequestVRF = () => {
    if (!gameId) return
    requestVRF({
      address: contractAddress,
      abi: PARTICIPATION_GAME_ABI,
      functionName: 'requestRandomWords',
      args: [gameId],
    })
  }

  const handleProcessVoting = () => {
    if (!gameId) return
    processVoting({
      address: contractAddress,
      abi: PARTICIPATION_GAME_ABI,
      functionName: 'processVotingResults',
      args: [gameId],
    })
  }

  const handleDistributePrize = () => {
    if (!gameId) return
    distributeFinalPrize({
      address: contractAddress,
      abi: PARTICIPATION_GAME_ABI,
      functionName: 'distributeFinalPrize',
      args: [gameId],
    })
  }

  const handlePause = () => {
    pauseGame({
      address: contractAddress,
      abi: PARTICIPATION_GAME_ABI,
      functionName: 'pauseGame',
    })
  }

  const handleUnpause = () => {
    unpauseGame({
      address: contractAddress,
      abi: PARTICIPATION_GAME_ABI,
      functionName: 'unpauseGame',
    })
  }

  if (!isConnected) {
    return (
      <PanelLayout type="admin">
        <div className="max-w-lg mx-auto">
          <div className="card text-center py-12">
            <Wallet className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
            <h2 className="text-heading-2 text-text-primary mb-2">Connect Wallet</h2>
            <p className="text-body-md text-text-secondary">
              Please connect your wallet to access the admin panel.
            </p>
          </div>
        </div>
      </PanelLayout>
    )
  }

  if (!hasAccess) {
    return (
      <PanelLayout type="admin">
        <div className="max-w-lg mx-auto">
          <div className="card-danger text-center py-12">
            <AlertTriangle className="w-16 h-16 text-status-danger mx-auto mb-4" />
            <h2 className="text-heading-2 text-text-primary mb-2">Access Denied</h2>
            <p className="text-body-md text-text-secondary mb-4">
              You don't have permission to access the admin panel.
            </p>
            <p className="text-body-sm text-text-tertiary font-mono">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
        </div>
      </PanelLayout>
    )
  }

  return (
    <PanelLayout type="admin">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-heading-1 text-text-primary">Admin Panel</h1>
            <span className="badge-warning">
              <Shield className="w-3 h-3" />
              {isOwner ? 'Owner' : 'Operator'}
            </span>
          </div>
          <p className="text-body-md text-text-secondary">
            Game #{gameId?.toString()} • Contract management and operations
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-accent-primary-muted">
              <TrendingUp className="w-4 h-4 text-accent-primary" />
            </div>
            <span className="text-body-sm text-text-secondary">Game Status</span>
          </div>
          <div className="text-heading-2 text-text-primary">{statusName}</div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-status-success-bg">
              <Coins className="w-4 h-4 text-status-success" />
            </div>
            <span className="text-body-sm text-text-secondary">Prize Pool</span>
          </div>
          <div className="text-heading-2 font-mono text-text-primary">{prizePoolFormatted}</div>
          <div className="text-body-sm text-text-tertiary">LUSD</div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-status-info-bg">
              <Users className="w-4 h-4 text-status-info" />
            </div>
            <span className="text-body-sm text-text-secondary">Participants</span>
          </div>
          <div className="text-heading-2 font-mono text-text-primary">{participantCount}</div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${isPaused ? 'bg-status-danger-bg' : 'bg-status-success-bg'}`}>
              {isPaused ? (
                <Pause className="w-4 h-4 text-status-danger" />
              ) : (
                <Play className="w-4 h-4 text-status-success" />
              )}
            </div>
            <span className="text-body-sm text-text-secondary">Contract</span>
          </div>
          <div className={`text-heading-2 ${isPaused ? 'text-status-danger' : 'text-status-success'}`}>
            {isPaused ? 'Paused' : 'Active'}
          </div>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Game Actions */}
        <div className="card">
          <h3 className="text-heading-3 text-text-primary mb-4">Game Actions</h3>
          <div className="space-y-3">
            {/* Request VRF */}
            <div className="p-4 rounded-lg bg-bg-hover">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5 text-status-warning" />
                <span className="font-medium text-text-primary">Request VRF</span>
              </div>
              <p className="text-body-sm text-text-secondary mb-3">
                Request random numbers from Chainlink VRF for elimination.
              </p>
              <button
                onClick={handleRequestVRF}
                disabled={isRequestingVRF || status !== GameStatus.CapReached}
                className="btn-primary w-full"
              >
                {isRequestingVRF && <Loader2 className="w-4 h-4 animate-spin" />}
                {status !== GameStatus.CapReached ? 'Requires Cap Reached' : 'Request VRF'}
              </button>
            </div>

            {/* Process Voting */}
            <div className="p-4 rounded-lg bg-bg-hover">
              <div className="flex items-center gap-3 mb-2">
                <Vote className="w-5 h-5 text-status-info" />
                <span className="font-medium text-text-primary">Process Voting</span>
              </div>
              <p className="text-body-sm text-text-secondary mb-3">
                Tally votes and advance to next stage.
              </p>
              <button
                onClick={handleProcessVoting}
                disabled={isProcessingVoting || (status !== GameStatus.Voting8 && status !== GameStatus.Voting4 && status !== GameStatus.Voting2)}
                className="btn-primary w-full"
              >
                {isProcessingVoting && <Loader2 className="w-4 h-4 animate-spin" />}
                Process Voting Results
              </button>
            </div>

            {/* Distribute Prize */}
            <div className="p-4 rounded-lg bg-bg-hover">
              <div className="flex items-center gap-3 mb-2">
                <Gift className="w-5 h-5 text-status-success" />
                <span className="font-medium text-text-primary">Distribute Prize</span>
              </div>
              <p className="text-body-sm text-text-secondary mb-3">
                Send prize to the winner and start new game.
              </p>
              <button
                onClick={handleDistributePrize}
                disabled={isDistributing || status !== GameStatus.Finished}
                className="btn-success w-full"
              >
                {isDistributing && <Loader2 className="w-4 h-4 animate-spin" />}
                Distribute Final Prize
              </button>
            </div>
          </div>
        </div>

        {/* Emergency Controls */}
        <div className="card-danger">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-status-danger" />
            <h3 className="text-heading-3 text-text-primary">Emergency Controls</h3>
          </div>
          
          <div className="p-4 rounded-lg bg-bg-hover mb-4">
            <p className="text-body-sm text-text-secondary mb-2">Contract Status</p>
            <div className={`text-heading-2 ${isPaused ? 'text-status-danger' : 'text-status-success'}`}>
              {isPaused ? 'PAUSED' : 'ACTIVE'}
            </div>
          </div>

          {isOwner ? (
            isPaused ? (
              <button
                onClick={handleUnpause}
                disabled={isUnpausing}
                className="btn-success w-full"
              >
                {isUnpausing && <Loader2 className="w-4 h-4 animate-spin" />}
                <Play className="w-4 h-4" />
                Unpause Contract
              </button>
            ) : (
              <button
                onClick={handlePause}
                disabled={isPausing}
                className="btn-danger w-full"
              >
                {isPausing && <Loader2 className="w-4 h-4 animate-spin" />}
                <Pause className="w-4 h-4" />
                Pause Contract
              </button>
            )
          ) : (
            <p className="text-body-sm text-text-tertiary text-center py-4">
              Only the contract owner can pause/unpause.
            </p>
          )}

          <p className="mt-4 text-body-sm text-text-tertiary">
            Pausing will prevent all user actions including purchases and votes.
          </p>
        </div>
      </div>

      {/* Progress Card */}
      <div className="card">
        <h3 className="text-heading-3 text-text-primary mb-4">Cap Progress</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-body-md">
            <span className="text-text-secondary">Revenue</span>
            <span className="font-mono text-text-primary">
              {Number(formatEther(totalRevenue)).toLocaleString()} LUSD
            </span>
          </div>
          <div className="flex justify-between text-body-md">
            <span className="text-text-secondary">Cap</span>
            <span className="font-mono text-text-primary">
              {Number(formatEther(tokenCap)).toLocaleString()} LUSD
            </span>
          </div>
          <div className="progress-bar h-3">
            <div 
              className="progress-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="text-right text-body-sm text-accent-primary font-medium">
            {progress.toFixed(1)}%
          </div>
        </div>
      </div>
    </PanelLayout>
  )
}
