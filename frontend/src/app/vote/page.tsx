'use client'

import { useState, useEffect } from 'react'
import { NavbarLayout } from '@/components/layout/NavbarLayout'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useContractData, useGameStatus } from '@/lib/hooks'
import { PARTICIPATION_GAME_ABI } from '@/config/contracts'
import { useQueryClient } from '@tanstack/react-query'
import { 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  Loader2, 
  CheckCircle,
  Users,
  AlertCircle,
  Wallet
} from 'lucide-react'
import Link from 'next/link'

export default function VotePage() {
  const { isConnected, address } = useAccount()
  const { 
    gameId, 
    gameDetails, 
    voteTallies, 
    activeParticipants,
    userParticipant,
    contractAddress 
  } = useContractData()
  const { isVoting, votingStage } = useGameStatus()
  const queryClient = useQueryClient()
  const [timeRemaining, setTimeRemaining] = useState('00:00:00')

  const { writeContract: submitVote, isPending, data: voteHash } = useWriteContract()
  const { isLoading: isWaitingVote, isSuccess: voteSuccess } = useWaitForTransactionReceipt({
    hash: voteHash,
  })

  useEffect(() => {
    if (voteSuccess) {
      queryClient.invalidateQueries()
    }
  }, [voteSuccess, queryClient])

  const continueVotes = Number(voteTallies?.[0] || 0n)
  const stopVotes = Number(voteTallies?.[1] || 0n)
  const totalVotes = continueVotes + stopVotes
  const continuePercent = totalVotes > 0 ? (continueVotes / totalVotes) * 100 : 50
  const stopPercent = totalVotes > 0 ? (stopVotes / totalVotes) * 100 : 50

  const votingDeadline = Number(gameDetails?.votingDeadline || 0n)
  const hasVotedInStage = userParticipant?.hasVotedInCurrentStage || false
  const userIsActiveParticipant = activeParticipants?.includes(address as `0x${string}`) || false

  // Countdown timer
  useEffect(() => {
    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000)
      const remaining = votingDeadline - now

      if (remaining <= 0) {
        setTimeRemaining('00:00:00')
        return
      }

      const hours = Math.floor(remaining / 3600)
      const minutes = Math.floor((remaining % 3600) / 60)
      const seconds = remaining % 60

      setTimeRemaining(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      )
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [votingDeadline])

  const handleVote = (decision: boolean) => {
    submitVote({
      address: contractAddress,
      abi: PARTICIPATION_GAME_ABI,
      functionName: 'submitVote',
      args: [gameId, decision],
    })
  }

  const isUrgent = votingDeadline - Math.floor(Date.now() / 1000) < 3600
  const isCritical = votingDeadline - Math.floor(Date.now() / 1000) < 600

  // Not in voting phase
  if (!isVoting) {
    return (
      <NavbarLayout>
        <div className="max-w-lg mx-auto">
          <div className="card text-center py-12">
            <AlertCircle className="w-16 h-16 text-status-warning mx-auto mb-4" />
            <h2 className="text-heading-2 text-text-primary mb-2">No Active Voting</h2>
            <p className="text-body-md text-text-secondary mb-6">
              Voting is not currently active. The game must reach the cap and complete elimination first.
            </p>
            <Link href="/" className="btn-secondary">
              View Game Status
            </Link>
          </div>
        </div>
      </NavbarLayout>
    )
  }

  // Not connected
  if (!isConnected) {
    return (
      <NavbarLayout>
        <div className="max-w-lg mx-auto">
          <div className="card text-center py-12">
            <Wallet className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
            <h2 className="text-heading-2 text-text-primary mb-2">Connect Wallet</h2>
            <p className="text-body-md text-text-secondary">
              Please connect your wallet to view voting status.
            </p>
          </div>
        </div>
      </NavbarLayout>
    )
  }

  return (
    <NavbarLayout>
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-heading-1 text-text-primary mb-2">Voting Round</h1>
          <p className="text-body-md text-text-secondary">
            Game #{gameId?.toString()} • Stage {votingStage}
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="card-highlighted mb-8 text-center py-8">
          <div className="text-body-sm text-text-secondary mb-2">Time Remaining</div>
          <div className={`text-display-1 font-mono ${
            isCritical ? 'text-status-danger animate-countdown-pulse' : 
            isUrgent ? 'text-status-warning' : 'text-text-primary'
          }`}>
            {timeRemaining}
          </div>
          {isCritical && (
            <div className="mt-2 text-body-sm text-status-danger">
              Hurry! Voting ends soon
            </div>
          )}
        </div>

        {/* Vote Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Continue Card */}
          <div className={`card p-6 ${hasVotedInStage && userParticipant?.defaultVote ? 'ring-2 ring-status-success' : ''}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-status-success-bg">
                <ThumbsUp className="w-6 h-6 text-status-success" />
              </div>
              <div>
                <h3 className="text-heading-2 text-text-primary">Continue</h3>
                <p className="text-body-sm text-text-secondary">Eliminate half, continue playing</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-body-sm mb-2">
                <span className="text-text-secondary">Votes</span>
                <span className="text-status-success font-bold">{continueVotes}</span>
              </div>
              <div className="progress-bar h-3">
                <div 
                  className="progress-fill bg-status-success"
                  style={{ width: `${continuePercent}%` }}
                />
              </div>
            </div>

            {userIsActiveParticipant && !hasVotedInStage && (
              <button
                onClick={() => handleVote(true)}
                disabled={isPending || isWaitingVote}
                className="btn-success w-full"
              >
                {(isPending || isWaitingVote) && <Loader2 className="w-4 h-4 animate-spin" />}
                Vote Continue
              </button>
            )}

            {hasVotedInStage && userParticipant?.defaultVote && (
              <div className="flex items-center justify-center gap-2 text-status-success">
                <CheckCircle className="w-5 h-5" />
                <span>You voted Continue</span>
              </div>
            )}
          </div>

          {/* Stop Card */}
          <div className={`card p-6 ${hasVotedInStage && !userParticipant?.defaultVote ? 'ring-2 ring-status-danger' : ''}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-status-danger-bg">
                <ThumbsDown className="w-6 h-6 text-status-danger" />
              </div>
              <div>
                <h3 className="text-heading-2 text-text-primary">Stop</h3>
                <p className="text-body-sm text-text-secondary">End game, select winner now</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-body-sm mb-2">
                <span className="text-text-secondary">Votes</span>
                <span className="text-status-danger font-bold">{stopVotes}</span>
              </div>
              <div className="progress-bar h-3">
                <div 
                  className="progress-fill"
                  style={{ width: `${stopPercent}%`, background: 'var(--gradient-danger)' }}
                />
              </div>
            </div>

            {userIsActiveParticipant && !hasVotedInStage && (
              <button
                onClick={() => handleVote(false)}
                disabled={isPending || isWaitingVote}
                className="btn-danger w-full"
              >
                {(isPending || isWaitingVote) && <Loader2 className="w-4 h-4 animate-spin" />}
                Vote Stop
              </button>
            )}

            {hasVotedInStage && !userParticipant?.defaultVote && (
              <div className="flex items-center justify-center gap-2 text-status-danger">
                <CheckCircle className="w-5 h-5" />
                <span>You voted Stop</span>
              </div>
            )}
          </div>
        </div>

        {/* Active Participants */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-accent-primary" />
            <h3 className="text-heading-3 text-text-primary">
              Active Participants ({activeParticipants?.length || 0})
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {activeParticipants?.map((addr) => {
              const isUser = addr.toLowerCase() === address?.toLowerCase()
              const truncated = `${addr.slice(0, 6)}...${addr.slice(-4)}`
              
              return (
                <div
                  key={addr}
                  className={`px-3 py-1.5 rounded-full text-body-sm font-mono ${
                    isUser 
                      ? 'bg-accent-primary-muted text-accent-primary border border-accent-primary/30' 
                      : 'bg-bg-hover text-text-secondary'
                  }`}
                >
                  {isUser ? '★ ' : ''}{truncated}
                </div>
              )
            })}
          </div>

          {!userIsActiveParticipant && (
            <div className="mt-4 p-3 rounded-lg bg-bg-hover text-body-sm text-text-secondary">
              You are not an active participant in this voting round.
            </div>
          )}
        </div>
      </div>
    </NavbarLayout>
  )
}
