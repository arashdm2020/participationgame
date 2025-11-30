'use client'

import { useTranslations } from 'next-intl'
import { useAccount } from 'wagmi'
import { Card, CardContent } from '@/components/ui/card'
import { GameStats } from '@/components/game/GameStats'
import { BuyShares } from '@/components/game/BuyShares'
import { VotingPanel } from '@/components/game/VotingPanel'
import { GameProgress } from '@/components/game/GameProgress'
import { WinnersHistory } from '@/components/game/WinnersHistory'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Wallet, Coins, Users, Trophy } from 'lucide-react'
import { useContractData, useGameStatus } from '@/lib/hooks'
import { formatLUSD } from '@/lib/utils'

export default function DashboardPage() {
  const t = useTranslations()
  const { isConnected } = useAccount()
  const { gameId, userShares, isParticipant, lusdBalance } = useContractData()
  const { statusName, isVoting, isBuying } = useGameStatus()

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20">
        <Card className="glass-card max-w-md mx-auto text-center p-6 md:p-8">
          <Wallet className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 md:mb-6 text-amber-500" />
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
            {t('errors.walletNotConnected')}
          </h2>
          <p className="text-slate-400 mb-4 md:mb-6 text-sm md:text-base">
            {t('dashboard.connectToAccess')}
          </p>
          <ConnectButton />
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {t('dashboard.title')}
        </h1>
        <p className="text-slate-400 text-sm md:text-base">
          {t('winners.round')} #{gameId?.toString() || '1'} • {statusName}
        </p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <Card className="glass-card p-3 md:p-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Coins className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-slate-400">{t('dashboard.myShares')}</p>
              <p className="text-lg md:text-xl font-bold text-white">{userShares.toString()}</p>
            </div>
          </div>
        </Card>
        <Card className="glass-card p-3 md:p-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Wallet className="h-4 w-4 md:h-5 md:w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-slate-400">{t('dashboard.balance')}</p>
              <p className="text-lg md:text-xl font-bold text-white">{formatLUSD(lusdBalance || 0n)}</p>
            </div>
          </div>
        </Card>
        <Card className="glass-card p-3 md:p-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-slate-400">{t('dashboard.status')}</p>
              <p className="text-sm md:text-base font-bold text-white">
                {isParticipant ? t('dashboard.participating') : t('dashboard.notParticipating')}
              </p>
            </div>
          </div>
        </Card>
        <Card className="glass-card p-3 md:p-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Trophy className="h-4 w-4 md:h-5 md:w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-slate-400">{t('dashboard.gamePhase')}</p>
              <p className="text-sm md:text-base font-bold text-white">{statusName}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        <GameStats />
        {isBuying ? <BuyShares /> : <VotingPanel variant="full" />}
      </div>

      {/* Game Progress */}
      <div className="mb-6">
        <GameProgress />
      </div>

      {/* Winners History */}
      <WinnersHistory />
    </div>
  )
}
