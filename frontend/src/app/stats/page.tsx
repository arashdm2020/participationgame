'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { useAccount } from 'wagmi'
import { useContractData, useGameStatus } from '@/lib/hooks'
import { formatEther } from 'viem'
import { 
  Wallet, 
  Coins, 
  Trophy, 
  Users, 
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function StatsPage() {
  const { isConnected, address } = useAccount()
  const { 
    gameId, 
    userShares, 
    isParticipant, 
    isActiveParticipant,
    lusdBalance,
    hasVoted
  } = useContractData()
  const { statusName, isVoting, isBuying } = useGameStatus()

  const sharesFormatted = userShares.toString()
  const balanceFormatted = lusdBalance 
    ? Number(formatEther(lusdBalance)).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '0.00'

  if (!isConnected) {
    return (
      <MainLayout>
        <div className="max-w-lg mx-auto">
          <div className="card text-center py-12">
            <Wallet className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
            <h2 className="text-heading-2 text-text-primary mb-2">Connect Wallet</h2>
            <p className="text-body-md text-text-secondary">
              Please connect your wallet to view your stats.
            </p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-heading-1 text-text-primary mb-2">My Stats</h1>
        <p className="text-body-md text-text-secondary">
          Your participation overview and history
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-accent-primary-muted">
              <Coins className="w-5 h-5 text-accent-primary" />
            </div>
            <span className="text-body-sm text-text-secondary">My Shares</span>
          </div>
          <div className="text-display-2 font-mono text-text-primary">{sharesFormatted}</div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-status-warning-bg">
              <Wallet className="w-5 h-5 text-status-warning" />
            </div>
            <span className="text-body-sm text-text-secondary">LUSD Balance</span>
          </div>
          <div className="text-heading-2 font-mono text-text-primary">{balanceFormatted}</div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-status-info-bg">
              <Users className="w-5 h-5 text-status-info" />
            </div>
            <span className="text-body-sm text-text-secondary">Status</span>
          </div>
          <div className="text-heading-3 text-text-primary">
            {isActiveParticipant ? 'Active Voter' : isParticipant ? 'Participant' : 'Not Joined'}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-status-success-bg">
              <Trophy className="w-5 h-5 text-status-success" />
            </div>
            <span className="text-body-sm text-text-secondary">Total Wins</span>
          </div>
          <div className="text-display-2 font-mono text-text-primary">0</div>
        </div>
      </div>

      {/* Current Game Status */}
      <div className="card mb-8">
        <h3 className="text-heading-3 text-text-primary mb-4">Current Game</h3>
        
        <div className="p-4 rounded-lg bg-bg-hover mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-body-md text-text-secondary">Game</span>
            <span className="text-heading-3 text-text-primary">#{gameId?.toString()}</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-body-md text-text-secondary">Status</span>
            <span className="badge-info">{statusName}</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-body-md text-text-secondary">Your Shares</span>
            <span className="font-mono text-text-primary">{sharesFormatted}</span>
          </div>
          {isVoting && (
            <div className="flex items-center justify-between">
              <span className="text-body-md text-text-secondary">Vote Status</span>
              {hasVoted ? (
                <span className="badge-success">
                  <CheckCircle className="w-3 h-3" />
                  Voted
                </span>
              ) : isActiveParticipant ? (
                <span className="badge-warning">
                  <Clock className="w-3 h-3" />
                  Pending
                </span>
              ) : (
                <span className="badge-neutral">Not Eligible</span>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        {isBuying && (
          <Link href="/buy" className="btn-primary w-full">
            Buy More Shares
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
        {isVoting && isActiveParticipant && !hasVoted && (
          <Link href="/vote" className="btn-primary w-full">
            Cast Your Vote
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Participation History */}
      <div className="card">
        <h3 className="text-heading-3 text-text-primary mb-4">Participation History</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left py-3 px-4 text-body-sm text-text-secondary font-medium">Game</th>
                <th className="text-left py-3 px-4 text-body-sm text-text-secondary font-medium">Shares</th>
                <th className="text-left py-3 px-4 text-body-sm text-text-secondary font-medium">Result</th>
                <th className="text-right py-3 px-4 text-body-sm text-text-secondary font-medium">Prize</th>
              </tr>
            </thead>
            <tbody>
              {isParticipant && (
                <tr className="border-b border-border-subtle">
                  <td className="py-3 px-4 font-mono text-text-primary">#{gameId?.toString()}</td>
                  <td className="py-3 px-4 font-mono text-text-primary">{sharesFormatted}</td>
                  <td className="py-3 px-4">
                    <span className="badge-info">In Progress</span>
                  </td>
                  <td className="py-3 px-4 text-right text-text-tertiary">-</td>
                </tr>
              )}
              {!isParticipant && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-text-tertiary">
                    No participation history yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  )
}
