'use client'

import { useContractData } from '@/lib/hooks'
import { formatEther } from 'viem'
import { TrendingUp } from 'lucide-react'

export function PrizePoolCard() {
  const { gameDetails, gameId } = useContractData()

  const prizePool = gameDetails?.prizePool || 0n
  const tokenCap = gameDetails?.tokenCap || 0n
  const totalRevenue = gameDetails?.totalRevenue || 0n
  
  const prizePoolFormatted = Number(formatEther(prizePool)).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  
  const progress = tokenCap > 0n 
    ? Number((totalRevenue * 100n) / tokenCap) 
    : 0
  
  const capFormatted = Number(formatEther(tokenCap)).toLocaleString()
  const revenueFormatted = Number(formatEther(totalRevenue)).toLocaleString()

  return (
    <div className="card-highlighted">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-text-secondary">
          <TrendingUp className="w-5 h-5 text-accent-primary" />
          <span className="text-body-sm font-medium">Prize Pool</span>
        </div>
        <span className="badge-neutral">Game #{gameId?.toString()}</span>
      </div>

      <div className="mb-6">
        <div className="text-display-1 font-mono text-text-primary mb-1">
          {prizePoolFormatted}
        </div>
        <div className="text-body-lg text-text-secondary">LUSD</div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="progress-bar h-3">
          <div 
            className="progress-fill"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
          {progress < 100 && <div className="progress-shimmer" />}
        </div>
        <div className="flex justify-between text-body-sm">
          <span className="text-text-secondary">
            {revenueFormatted} / {capFormatted} LUSD
          </span>
          <span className="text-accent-primary font-medium">
            {progress.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  )
}
