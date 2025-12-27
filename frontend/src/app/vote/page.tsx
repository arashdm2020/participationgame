'use client'

import { useState, useEffect } from 'react'
import { NavbarLayout } from '@/components/layout/NavbarLayout'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useContractData, useGameStatus } from '@/lib/hooks'
import { PARTICIPATION_GAME_ABI } from '@/config/contracts'
import { useQueryClient } from '@tanstack/react-query'
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

  const votingDeadline = Number(gameDetails?.votingDeadline || 0n)
  const hasVotedInStage = userParticipant?.hasVotedInCurrentStage || false
  const userIsActiveParticipant = activeParticipants?.includes(address as `0x${string}`) || false
  const userVotedContinue = userParticipant?.defaultVote || false

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

  const isProcessing = isPending || isWaitingVote
  const isUrgent = votingDeadline - Math.floor(Date.now() / 1000) < 3600
  const isCritical = votingDeadline - Math.floor(Date.now() / 1000) < 600

  // Not in voting phase
  if (!isVoting) {
    return (
      <NavbarLayout>
        <div className="max-w-[600px] mx-auto pt-20">
          <div className="panel p-8 text-center">
            <div className="text-gold text-h2 mb-3">No Active Voting</div>
            <p className="text-body text-white-secondary mb-6">
              Voting is not active. The game must reach the cap and complete selection first.
            </p>
            <Link href="/" className="btn btn-outline">
              View Dashboard
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
        <div className="max-w-[600px] mx-auto pt-20">
          <div className="panel p-8 text-center">
            <div className="text-h2 text-white-primary mb-3">Connect Wallet</div>
            <p className="text-body text-white-secondary">
              Connect your wallet to view voting status.
            </p>
          </div>
        </div>
      </NavbarLayout>
    )
  }

  return (
    <NavbarLayout>
      <div className="max-w-[700px] mx-auto">
        
        {/* Header */}
        <header className="mb-8 pt-8">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="label mb-2">Voting Round {votingStage}</div>
              <h1 className="text-h1 text-white-primary">Game #{gameId?.toString()}</h1>
            </div>
            <div className="text-right">
              <div className="label mb-1">Time Left</div>
              <div className={`font-mono text-display-md ${
                isCritical ? 'text-gold animate-tick' : 
                isUrgent ? 'text-gold' : 'text-white-primary'
              }`}>
                {timeRemaining}
              </div>
            </div>
          </div>
        </header>

        {/* Vote Status Bar */}
        <section className="mb-8">
          <div className="panel p-6">
            <div className="flex justify-between text-caption mb-3">
              <span className="text-gold">CONTINUE ({continueVotes})</span>
              <span className="text-white-secondary">STOP ({stopVotes})</span>
            </div>
            <div className="h-2 bg-white-ghost flex">
              <div 
                className="h-full bg-gold transition-all duration-500"
                style={{ width: `${continuePercent}%` }}
              />
            </div>
            <div className="flex justify-between text-caption mt-2 text-white-tertiary">
              <span>Eliminate half, continue game</span>
              <span>End game, pick winner now</span>
            </div>
          </div>
        </section>

        {/* Vote Actions */}
        {userIsActiveParticipant && !hasVotedInStage ? (
          <section className="mb-8">
            <div className="grid grid-cols-2 gap-px bg-white-ghost">
              <button
                onClick={() => handleVote(true)}
                disabled={isProcessing}
                className="bg-surface p-8 hover:bg-elevated transition-colors text-center group disabled:opacity-50"
              >
                <div className="text-gold text-h2 mb-2 group-hover:scale-105 transition-transform">Continue</div>
                <div className="text-body-sm text-white-tertiary">Eliminate half, keep playing</div>
              </button>
              <button
                onClick={() => handleVote(false)}
                disabled={isProcessing}
                className="bg-surface p-8 hover:bg-elevated transition-colors text-center group disabled:opacity-50"
              >
                <div className="text-white-primary text-h2 mb-2 group-hover:scale-105 transition-transform">Stop</div>
                <div className="text-body-sm text-white-tertiary">End game, select winner</div>
              </button>
            </div>
            {isProcessing && (
              <div className="text-center text-caption text-gold mt-4 animate-pulse-gold">
                Processing vote...
              </div>
            )}
          </section>
        ) : hasVotedInStage ? (
          <section className="mb-8">
            <div className="panel-gold p-6 text-center">
              <div className="label label-gold mb-2">Vote Submitted</div>
              <div className="text-h3 text-white-primary">
                You voted <span className={userVotedContinue ? 'text-gold' : 'text-white-primary'}>
                  {userVotedContinue ? 'Continue' : 'Stop'}
                </span>
              </div>
              <p className="text-body-sm text-white-secondary mt-2">
                Waiting for other participants...
              </p>
            </div>
          </section>
        ) : (
          <section className="mb-8">
            <div className="panel p-6 text-center">
              <div className="text-h4 text-white-tertiary mb-2">Observer Mode</div>
              <p className="text-body-sm text-white-secondary">
                You are not an active participant in this voting round.
              </p>
            </div>
          </section>
        )}

        {/* Participants */}
        <section>
          <div className="label mb-4">Active Participants ({activeParticipants?.length || 0})</div>
          <div className="panel p-4">
            <div className="flex flex-wrap gap-2">
              {activeParticipants?.map((addr) => {
                const isUser = addr.toLowerCase() === address?.toLowerCase()
                const truncated = `${addr.slice(0, 6)}...${addr.slice(-4)}`
                
                return (
                  <div
                    key={addr}
                    className={`px-3 py-1.5 font-mono text-mono-sm ${
                      isUser 
                        ? 'bg-gold-muted text-gold border border-gold/30' 
                        : 'bg-white-ghost text-white-secondary'
                    }`}
                  >
                    {isUser ? '● ' : ''}{truncated}
                  </div>
                )
              })}
            </div>

            {!userIsActiveParticipant && (
              <div className="mt-4 pt-4 border-t border-white-ghost text-body-sm text-white-tertiary">
                You are not an active participant in this voting round.
              </div>
            )}
          </div>
        </section>

      </div>
    </NavbarLayout>
  )
}
