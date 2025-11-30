'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, Calendar, Coins, ExternalLink, ChevronDown } from 'lucide-react'
import { formatAddress, formatLUSD } from '@/lib/utils'

// Mock data - in production this would come from contract events
const mockWinners = [
  {
    gameId: 45,
    address: '0x1234567890abcdef1234567890abcdef12345678',
    prizeAmount: '2125000000000000000000',
    date: '۱۴۰۳/۰۷/۲۵',
    txHash: '0xabc123',
  },
]

export function WinnersHistory() {
  const t = useTranslations('winners')
  const [selectedRound, setSelectedRound] = useState<number | null>(45)
  
  const blockExplorer = 'https://sepolia.arbiscan.io'
  const winners = mockWinners

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-amber-500" />
            {t('title')}
          </CardTitle>
          <Button variant="secondary" size="sm" className="text-xs gap-1">
            {t('round')} #{selectedRound || 45}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {winners.length === 0 ? (
          <p className="text-center text-slate-400 py-8">{t('noWinners')}</p>
        ) : (
          <div className="space-y-3">
            {winners.map((winner) => (
              <div
                key={winner.gameId}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-700/30 border border-slate-600/50 hover:border-amber-500/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Round Badge */}
                  <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-slate-800 border border-slate-600">
                    <span className="text-[10px] text-slate-400">{t('round')}</span>
                    <span className="text-lg font-bold text-amber-500">
                      #{winner.gameId}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <span>{t('date')}: {winner.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-green-500" />
                      <span className="text-green-400 font-semibold">
                        {t('prize')}: {formatLUSD(BigInt(winner.prizeAmount))} LUSD
                      </span>
                    </div>
                  </div>
                </div>

                {/* Winner Info */}
                <div className="flex items-center gap-3">
                  <div className="text-end">
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                      {t('finalWinner')}
                    </span>
                    <div className="mt-1 flex items-center gap-2 justify-end">
                      <code className="text-sm text-slate-300">
                        {formatAddress(winner.address)}
                      </code>
                      {winner.txHash && (
                        <a
                          href={`${blockExplorer}/tx/${winner.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-500 hover:text-amber-400"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
