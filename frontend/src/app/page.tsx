'use client'

import { useTranslations } from 'next-intl'
import { GameStats } from '@/components/game/GameStats'
import { BuyShares } from '@/components/game/BuyShares'
import { VotingPanel } from '@/components/game/VotingPanel'
import { GameProgress } from '@/components/game/GameProgress'
import { WinnersHistory } from '@/components/game/WinnersHistory'

export default function Home() {
  const t = useTranslations()

  return (
    <div className="min-h-screen py-6">
      <div className="container mx-auto px-4">
        {/* Top Section - Stats, Buy, Voting */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Game Stats */}
          <GameStats />
          
          {/* Buy Shares */}
          <BuyShares />
          
          {/* Stage Votes */}
          <VotingPanel variant="compact" />
        </div>

        {/* Progress Section */}
        <div className="mb-6">
          <GameProgress />
        </div>

        {/* Voting Panel - Full */}
        <div className="mb-6">
          <VotingPanel variant="full" />
        </div>

        {/* Winners History */}
        <div>
          <WinnersHistory />
        </div>
      </div>
    </div>
  )
}
