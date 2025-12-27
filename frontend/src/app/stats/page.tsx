'use client'

import { NavbarLayout } from '@/components/layout/NavbarLayout'
import { useAccount } from 'wagmi'
import { useContractData, useGameStatus } from '@/lib/hooks'
import { formatEther } from 'viem'
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

  const sharesFormatted = Number(formatEther(userShares)).toLocaleString()
  const balanceFormatted = lusdBalance 
    ? Number(formatEther(lusdBalance)).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '0.00'

  if (!isConnected) {
    return (
      <NavbarLayout>
        <div className="max-w-[600px] mx-auto pt-20">
          <div className="panel p-8 text-center">
            <div className="text-h2 text-white-primary mb-3">Connect Wallet</div>
            <p className="text-body text-white-secondary">
              Connect your wallet to view your position.
            </p>
          </div>
        </div>
      </NavbarLayout>
    )
  }

  return (
    <NavbarLayout>
      <div className="max-w-[800px] mx-auto">
        
        {/* Header */}
        <header className="mb-8 pt-8">
          <div className="label mb-2">Your Position</div>
          <h1 className="text-h1 text-white-primary">Game #{gameId?.toString() || '—'}</h1>
        </header>

        {/* Main Stats */}
        <section className="grid grid-cols-2 gap-px bg-white-ghost mb-px">
          <div className="bg-surface p-6">
            <div className="label mb-2">Shares Owned</div>
            <div className="value-display text-display-lg value-gold">{sharesFormatted}</div>
          </div>
          <div className="bg-surface p-6">
            <div className="label mb-2">Share Value</div>
            <div className="value-display text-display-lg">{sharesFormatted} <span className="text-white-tertiary text-h3">LUSD</span></div>
          </div>
        </section>

        {/* Status */}
        <section className="grid grid-cols-3 gap-px bg-white-ghost mb-8">
          <div className="bg-surface p-5">
            <div className="label mb-2">Wallet Balance</div>
            <div className="font-mono text-mono-lg text-white-primary">{balanceFormatted}</div>
            <div className="text-caption text-white-tertiary">LUSD</div>
          </div>
          <div className="bg-surface p-5">
            <div className="label mb-2">Game Phase</div>
            <div className="text-h3 text-white-primary">{statusName}</div>
          </div>
          <div className="bg-surface p-5">
            <div className="label mb-2">Participation</div>
            <div className="text-h3">
              {isActiveParticipant ? (
                <span className="text-gold">Active Voter</span>
              ) : isParticipant ? (
                <span className="text-white-primary">Joined</span>
              ) : (
                <span className="text-white-tertiary">Not joined</span>
              )}
            </div>
          </div>
        </section>

        {/* Action Required */}
        {isVoting && isActiveParticipant && !hasVoted && (
          <section className="mb-8">
            <div className="panel-gold p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="label label-gold mb-1">Action Required</div>
                  <div className="text-h3 text-white-primary">Cast your vote</div>
                  <p className="text-body-sm text-white-secondary mt-1">
                    You are an active participant. Your vote matters.
                  </p>
                </div>
                <Link href="/vote" className="btn btn-gold">
                  Vote Now
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Next Action */}
        <section className="mb-8">
          <div className="label mb-4">Next Action</div>
          <div className="panel p-6">
            {isBuying ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-h4 text-white-primary mb-1">Buy more shares</div>
                  <p className="text-body-sm text-white-secondary">
                    Increase your chances by acquiring more shares.
                  </p>
                </div>
                <Link href="/" className="btn btn-outline">
                  Buy Shares
                </Link>
              </div>
            ) : isVoting ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-h4 text-white-primary mb-1">Voting in progress</div>
                  <p className="text-body-sm text-white-secondary">
                    {isActiveParticipant 
                      ? hasVoted 
                        ? 'You have voted. Waiting for results.' 
                        : 'Cast your vote before the deadline.'
                      : 'You are not in this voting round.'}
                  </p>
                </div>
                {isActiveParticipant && !hasVoted && (
                  <Link href="/vote" className="btn btn-gold">
                    Vote
                  </Link>
                )}
              </div>
            ) : (
              <div>
                <div className="text-h4 text-white-primary mb-1">Wait for next round</div>
                <p className="text-body-sm text-white-secondary">
                  The current game is in progress. Check back later.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* History */}
        <section>
          <div className="label mb-4">History</div>
          <div className="panel">
            <table className="table">
              <thead>
                <tr>
                  <th>Game</th>
                  <th>Shares</th>
                  <th>Result</th>
                  <th className="text-right">Prize</th>
                </tr>
              </thead>
              <tbody>
                {isParticipant ? (
                  <tr>
                    <td className="font-mono text-white-primary">#{gameId?.toString()}</td>
                    <td className="font-mono">{sharesFormatted}</td>
                    <td><span className="indicator indicator-gold">In Progress</span></td>
                    <td className="text-right text-white-tertiary">—</td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-white-tertiary py-8">
                      No participation history
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </NavbarLayout>
  )
}
