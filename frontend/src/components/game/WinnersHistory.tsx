'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, ExternalLink, Loader2, Hash } from 'lucide-react'
import { formatAddress, formatLUSD } from '@/lib/utils'
import { useContractData, useGameStatus } from '@/lib/hooks'
import { BLOCK_EXPLORER } from '@/config/wagmi'

export function WinnersHistory() {
  const t = useTranslations('winners')
  const { gameId, gameDetails, gameWinner, isLoading } = useContractData()
  const { isFinished } = useGameStatus()

  const prizePool = gameDetails?.prizePool || 0n
  // 85% goes to winner
  const winnerPrize = (prizePool * 85n) / 100n
  const hasWinner = gameWinner && gameWinner !== '0x0000000000000000000000000000000000000000'

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
            <Trophy className="h-5 w-5 text-amber-500" />
            {t('title')}
          </CardTitle>
          <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-slate-700/50 text-xs">
            <Hash className="h-3 w-3 text-amber-500" />
            <span className="text-slate-300">{t('round')} {gameId?.toString()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!hasWinner ? (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">{t('noWinners')}</p>
            <p className="text-slate-500 text-sm mt-1">
              {isFinished ? t('noWinners') : t('gameInProgress')}
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Winner Info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Trophy className="h-7 w-7 text-white" />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                    {t('finalWinner')}
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="text-sm text-slate-300">
                      {formatAddress(gameWinner)}
                    </code>
                    <a
                      href={`${BLOCK_EXPLORER}/address/${gameWinner}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-500 hover:text-amber-400"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Prize Amount */}
              <div className="text-center sm:text-end">
                <p className="text-slate-400 text-sm">{t('prize')}</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatLUSD(winnerPrize)} LUSD
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
