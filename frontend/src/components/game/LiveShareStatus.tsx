'use client'

import { useState, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'

interface ShareStats {
  totalShares: number
  targetShares: number
  totalParticipants: number
  poolValue: number
  lastPurchaseTime: string
}

const MOCK_STATS: ShareStats = {
  totalShares: 64,
  targetShares: 100,
  totalParticipants: 12,
  poolValue: 57.60,
  lastPurchaseTime: '2 min'
}

export function LiveShareStatus() {
  const [stats] = useState(MOCK_STATS)
  const [animatedShares, setAnimatedShares] = useState(0)
  const [animatedPool, setAnimatedPool] = useState(0)

  useEffect(() => {
    const duration = 1200
    const steps = 40
    const shareIncrement = stats.totalShares / steps
    const poolIncrement = stats.poolValue / steps

    let step = 0
    const interval = setInterval(() => {
      step++
      setAnimatedShares(Math.min(Math.round(shareIncrement * step), stats.totalShares))
      setAnimatedPool(Math.min(poolIncrement * step, stats.poolValue))
      
      if (step >= steps) clearInterval(interval)
    }, duration / steps)

    return () => clearInterval(interval)
  }, [stats.totalShares, stats.poolValue])

  const progress = (stats.totalShares / stats.targetShares) * 100

  return (
    <div className="card p-4">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-status-success" />
          <span className="text-body-sm font-medium text-text-primary">Live Share Status</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
          <span className="text-body-xs text-status-success">Live</span>
        </div>
      </div>

      {/* Progress section */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1">
          <div className="h-2.5 bg-surface-tertiary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-accent-primary to-status-success rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="text-right min-w-[80px]">
          <span className="text-body-sm font-mono font-bold text-text-primary">{animatedShares}</span>
          <span className="text-body-xs text-text-tertiary">/{stats.targetShares}</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between text-body-xs border-t border-border-primary pt-2">
        <div className="flex items-center gap-4">
          <span className="text-text-tertiary">
            Remaining: <span className="text-text-primary font-medium">{stats.targetShares - stats.totalShares}</span>
          </span>
          <span className="text-text-tertiary">
            Progress: <span className="text-status-success font-medium">{progress.toFixed(0)}%</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-text-tertiary">
            <span className="text-text-primary font-medium">{stats.totalParticipants}</span> players
          </span>
          <span className="text-text-tertiary">
            <span className="text-accent-primary font-medium">{animatedPool.toFixed(2)}</span> LUSD
          </span>
          <span className="text-text-tertiary">
            Last: <span className="text-text-secondary">{stats.lastPurchaseTime} ago</span>
          </span>
        </div>
      </div>
    </div>
  )
}
