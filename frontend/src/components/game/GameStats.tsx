'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users, Coins, Trophy, Hash, Loader2 } from 'lucide-react'
import { formatLUSD } from '@/lib/utils'
import { useContractData, useGameStatus } from '@/lib/hooks'

export function GameStats() {
  const t = useTranslations('game.stats')
  const { 
    gameId,
    gameDetails, 
    participantCount, 
    activeParticipantCount,
    isLoading 
  } = useContractData()
  const { statusName, isBuying } = useGameStatus()

  const tokenCap = gameDetails?.tokenCap || 0n
  const totalRevenue = gameDetails?.totalRevenue || 0n
  const prizePool = gameDetails?.prizePool || 0n

  const progress = tokenCap > 0n 
    ? Number((totalRevenue * 100n) / tokenCap) 
    : 0

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-amber-500" />
            {t('title')}
          </CardTitle>
          <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-slate-700/50 text-xs">
            <Hash className="h-3 w-3 text-amber-500" />
            <span className="text-slate-300">{gameId?.toString()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Circle + Stats */}
        <div className="flex items-start gap-4">
          {/* Progress Circle */}
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                className="text-slate-700"
              />
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="url(#statsGradient)"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${progress * 3.02} 302`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="statsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-white">{progress.toFixed(1)}%</span>
              <span className="text-[10px] text-slate-400">{t('progress')}</span>
            </div>
          </div>

          {/* Stats List */}
          <div className="flex-1 space-y-2">
            <StatItem
              icon={<Coins className="h-4 w-4 text-green-500" />}
              label={t('sharesSold')}
              value={`${formatLUSD(totalRevenue)} LUSD`}
              highlight
            />
            <StatItem
              icon={<Users className="h-4 w-4 text-blue-500" />}
              label={isBuying ? t('totalParticipants') : t('activeParticipants')}
              value={isBuying ? participantCount.toString() : activeParticipantCount.toString()}
            />
            <StatItem
              icon={<Trophy className="h-4 w-4 text-amber-500" />}
              label={t('prizePool')}
              value={`${formatLUSD(prizePool)} LUSD`}
            />
          </div>
        </div>

        {/* Status Badge */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-sm">{t('progress')}</span>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
              {statusName}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatItem({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-700/30">
      {icon}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-slate-400 truncate">{label}</p>
        <p className={`text-sm font-semibold ${highlight ? 'text-green-400' : 'text-white'}`}>
          {value}
        </p>
      </div>
    </div>
  )
}
