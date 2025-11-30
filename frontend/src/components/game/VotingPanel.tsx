'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useAccount, useWriteContract } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Vote, Clock, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'
import { PARTICIPATION_GAME_ABI, GameStatus } from '@/config/contracts'
import { cn } from '@/lib/utils'
import { useContractData, useGameStatus } from '@/lib/hooks'

interface VotingPanelProps {
  variant?: 'compact' | 'full'
}

export function VotingPanel({ variant = 'full' }: VotingPanelProps) {
  const t = useTranslations('game.voting')
  const { isConnected, address } = useAccount()
  const [timeRemaining, setTimeRemaining] = useState('00:00')
  
  const { 
    gameId, 
    gameDetails, 
    voteTallies, 
    activeParticipants,
    userParticipant,
    contractAddress 
  } = useContractData()
  const { votingStage, isVoting } = useGameStatus()

  const { writeContract: submitVote, isPending } = useWriteContract()

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
        setTimeRemaining('00:00')
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

  // Compact variant - Stage votes display for sidebar
  if (variant === 'compact') {
    return (
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Vote className="h-5 w-5 text-amber-500" />
            {t('stageVotes')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[8, 4, 2].map((stage) => (
            <div key={stage} className="flex items-center justify-between p-2 rounded-lg bg-slate-700/30">
              <span className="text-slate-300 text-sm">{t(`stage${stage}`)}</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className={cn(
                    'h-7 px-3',
                    votingStage === stage 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-slate-600 hover:bg-slate-500'
                  )}
                >
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  {t('continue')}
                </Button>
                <Button
                  size="sm"
                  className={cn(
                    'h-7 px-3',
                    votingStage === stage 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-slate-600 hover:bg-slate-500'
                  )}
                >
                  <ThumbsDown className="h-3 w-3 mr-1" />
                  {t('stop')}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  // Full variant - Complete voting panel
  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Vote className="h-5 w-5 text-amber-500" />
            {t('title')}
          </CardTitle>
          {isVoting && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400">
              <Clock className="h-4 w-4" />
              <span className="font-mono font-bold text-sm">{timeRemaining}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stage Tabs */}
        <div className="flex gap-2">
          {[8, 4, 2].map((stage) => (
            <Button
              key={stage}
              variant={votingStage === stage ? 'default' : 'secondary'}
              size="sm"
              className={cn(
                'flex-1',
                votingStage === stage && 'ring-2 ring-amber-500/50'
              )}
              disabled={votingStage !== stage}
            >
              {stage} {t('stage')}
            </Button>
          ))}
        </div>

        {/* Voting Results */}
        <div className="space-y-3 p-4 rounded-xl bg-slate-700/30">
          <h4 className="text-center text-slate-300 font-medium text-sm">
            {t('results')} - {votingStage || 8} {t('stage')}
          </h4>

          {/* Continue Votes Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-green-500" />
                <span className="text-slate-300">{t('continueVotes')}</span>
              </div>
              <span className="text-green-400 font-bold">{continueVotes}</span>
            </div>
            <div className="h-3 bg-slate-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${continuePercent}%` }}
              />
            </div>
          </div>

          {/* Stop Votes Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <ThumbsDown className="h-4 w-4 text-red-500" />
                <span className="text-slate-300">{t('stopVotes')}</span>
              </div>
              <span className="text-red-400 font-bold">{stopVotes}</span>
            </div>
            <div className="h-3 bg-slate-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-500"
                style={{ width: `${stopPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Vote Buttons */}
        {isVoting && (
          <div className="space-y-3">
            <p className="text-center text-slate-400 text-sm">{t('castVote')}</p>
            
            {!isConnected ? (
              <p className="text-center text-slate-500 text-sm">{t('notParticipant')}</p>
            ) : !userIsActiveParticipant ? (
              <p className="text-center text-slate-500 text-sm">{t('notParticipant')}</p>
            ) : hasVotedInStage ? (
              <p className="text-center text-green-400 text-sm">{t('alreadyVoted')}</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="success"
                  size="lg"
                  onClick={() => handleVote(true)}
                  disabled={isPending}
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  <ThumbsUp className="h-5 w-5" />
                  {t('voteContinue')}
                </Button>
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={() => handleVote(false)}
                  disabled={isPending}
                  className="w-full bg-red-500 hover:bg-red-600"
                >
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  <ThumbsDown className="h-5 w-5" />
                  {t('voteStop')}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
