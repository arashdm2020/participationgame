'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WinnersHistory } from '@/components/game/WinnersHistory'
import { networks } from '@/config/networks'
import { Trophy } from 'lucide-react'

export default function WinnersPage() {
  const t = useTranslations('winners')
  const network = networks.testnet

  // Mock data - in production, fetch from database or blockchain
  const winners = [
    {
      gameId: 45,
      address: '0x7899123456789012345678901234567890123456',
      prizeAmount: '2125000000000000000000',
      date: '2024/11/25',
      txHash: '0xabc123...',
    },
    {
      gameId: 44,
      address: '0x1234567890123456789012345678901234567890',
      prizeAmount: '1850000000000000000000',
      date: '2024/11/18',
      txHash: '0xdef456...',
    },
    {
      gameId: 43,
      address: '0x9876543210987654321098765432109876543210',
      prizeAmount: '2340000000000000000000',
      date: '2024/11/11',
      txHash: '0xghi789...',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <Trophy className="h-16 w-16 mx-auto mb-4 text-amber-500" />
        <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
        <p className="text-slate-400">
          Celebrating our lucky winners from past games
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <WinnersHistory winners={winners} blockExplorer={network.blockExplorer} />
      </div>
    </div>
  )
}
