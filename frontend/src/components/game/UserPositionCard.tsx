'use client'

import { useContractData, useGameStatus } from '@/lib/hooks'
import { useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { User, Wallet, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function UserPositionCard() {
  const { isConnected } = useAccount()
  const { userShares, isParticipant, isActiveParticipant, lusdBalance } = useContractData()
  const { isBuying } = useGameStatus()

  const sharesFormatted = userShares.toString()
  const balanceFormatted = lusdBalance 
    ? Number(formatEther(lusdBalance)).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '0.00'

  if (!isConnected) {
    return (
      <div className="card">
        <div className="flex items-center gap-2 mb-4 text-text-secondary">
          <User className="w-5 h-5" />
          <span className="text-body-sm font-medium">Your Position</span>
        </div>
        <div className="text-center py-8">
          <p className="text-text-secondary mb-2">Connect wallet to view your position</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-text-secondary">
          <User className="w-5 h-5" />
          <span className="text-body-sm font-medium">Your Position</span>
        </div>
        {isParticipant && (
          <span className="badge-success">
            <span className="status-dot-success" />
            Active
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* Shares */}
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Shares</span>
          <span className="text-heading-2 font-mono text-text-primary">{sharesFormatted}</span>
        </div>

        {/* Value */}
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Value</span>
          <span className="text-body-lg font-mono text-text-primary">{sharesFormatted} LUSD</span>
        </div>

        {/* Wallet Balance */}
        <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
          <div className="flex items-center gap-2 text-text-secondary">
            <Wallet className="w-4 h-4" />
            <span>Balance</span>
          </div>
          <span className="text-body-md font-mono text-text-secondary">{balanceFormatted} LUSD</span>
        </div>

        {/* Status */}
        {isActiveParticipant && (
          <div className="p-3 rounded-lg bg-accent-primary-muted border border-accent-primary/20">
            <p className="text-body-sm text-accent-primary">
              You are an active participant in the current voting round!
            </p>
          </div>
        )}

        {/* CTA */}
        {isBuying && (
          <Link href="/buy" className="btn-primary w-full mt-2">
            Buy More
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}
