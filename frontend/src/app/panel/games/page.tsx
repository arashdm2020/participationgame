'use client'

import { PanelLayout } from '@/components/layout/PanelLayout'
import { useAccount } from 'wagmi'
import { useContractData, useGameStatus } from '@/lib/hooks'
import { Wallet, Trophy, XCircle, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const STATUS_LABELS: Record<number, string> = {
  0: 'Buying',
  1: 'Cap Reached',
  2: 'VRF Pending',
  3: 'Eliminating',
  4: 'Voting (8)',
  5: 'Voting (4)',
  6: 'Voting (2)',
  7: 'Finished',
}

export default function GamesParticipatedPage() {
  const { isConnected } = useAccount()
  const { gameId, userShares, isParticipant, isActiveParticipant } = useContractData()
  const { status } = useGameStatus()

  // Build games list from current participation
  // In production, this would fetch historical data from events/database
  const games: Array<{
    id: bigint
    status: number
    shares: bigint
    role: 'active' | 'eliminated' | 'not_selected' | 'winner' | 'pending'
    result: string
    winnings: string
  }> = []

  // Add current game if participating
  if (isParticipant && gameId) {
    games.push({
      id: gameId,
      status: status,
      shares: userShares,
      role: isActiveParticipant ? 'active' : status === 7 ? 'not_selected' : 'pending',
      result: status === 7 ? 'Finished' : 'In Progress',
      winnings: '-',
    })
  }

  if (!isConnected) {
    return (
      <PanelLayout type="user">
        <div className="max-w-lg mx-auto">
          <div className="card text-center py-12">
            <Wallet className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
            <h2 className="text-heading-2 text-text-primary mb-2">Connect Wallet</h2>
            <p className="text-body-md text-text-secondary">
              Please connect your wallet to view game participation.
            </p>
          </div>
        </div>
      </PanelLayout>
    )
  }

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 text-status-success">
            <span className="w-2 h-2 rounded-full bg-status-success" />
            Active
          </span>
        )
      case 'winner':
        return (
          <span className="inline-flex items-center gap-1.5 text-accent-primary">
            <Trophy className="w-4 h-4" />
            Winner
          </span>
        )
      case 'eliminated':
        return (
          <span className="inline-flex items-center gap-1.5 text-status-danger">
            <XCircle className="w-4 h-4" />
            Eliminated
          </span>
        )
      case 'not_selected':
        return <span className="text-text-tertiary">Not Selected</span>
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-text-secondary">
            <Clock className="w-4 h-4" />
            Pending
          </span>
        )
    }
  }

  const getStatusBadge = (gameStatus: number) => {
    const label = STATUS_LABELS[gameStatus] || 'Unknown'
    if (gameStatus <= 3) return <span className="badge-warning">{label}</span>
    if (gameStatus <= 6) return <span className="badge-info">{label}</span>
    return <span className="badge-success">{label}</span>
  }

  return (
    <PanelLayout type="user">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-heading-1 text-text-primary mb-2">Games Participated</h1>
        <p className="text-body-md text-text-secondary">
          Your participation history and results
        </p>
      </div>

      {/* Games Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left py-3 px-4 text-body-sm text-text-secondary font-medium">Game</th>
                <th className="text-left py-3 px-4 text-body-sm text-text-secondary font-medium">Status</th>
                <th className="text-left py-3 px-4 text-body-sm text-text-secondary font-medium">Shares</th>
                <th className="text-left py-3 px-4 text-body-sm text-text-secondary font-medium">Role</th>
                <th className="text-right py-3 px-4 text-body-sm text-text-secondary font-medium">Result</th>
              </tr>
            </thead>
            <tbody>
              {games.length > 0 ? (
                games.map((game) => (
                  <tr key={game.id.toString()} className="border-b border-border-subtle last:border-0 hover:bg-bg-hover transition-colors">
                    <td className="py-4 px-4 font-mono text-text-primary">
                      #{game.id.toString()}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(game.status)}
                    </td>
                    <td className="py-4 px-4 font-mono text-text-primary">
                      {game.shares.toString()}
                    </td>
                    <td className="py-4 px-4">
                      {getRoleDisplay(game.role)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {game.winnings !== '-' ? (
                        <span className="text-status-success font-mono">+{game.winnings}</span>
                      ) : (
                        <span className="text-text-tertiary">{game.result}</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-text-tertiary">
                    <p className="mb-2">No games participated yet</p>
                    <Link href="/buy" className="text-accent-primary hover:underline">
                      Join your first game →
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 rounded-lg bg-bg-hover">
        <h4 className="text-body-sm font-medium text-text-primary mb-3">Role Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-body-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-status-success" />
            <span className="text-text-secondary">Active Voter</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-accent-primary" />
            <span className="text-text-secondary">Winner</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-status-danger" />
            <span className="text-text-secondary">Eliminated</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-text-tertiary" />
            <span className="text-text-secondary">Not Selected</span>
          </div>
        </div>
      </div>
    </PanelLayout>
  )
}
