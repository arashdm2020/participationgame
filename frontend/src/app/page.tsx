'use client'

import { NavbarLayout } from '@/components/layout/NavbarLayout'
import { HeroSection } from '@/components/game/HeroSection'
import { PrizePoolCard } from '@/components/game/PrizePoolCard'
import { UserPositionCard } from '@/components/game/UserPositionCard'
import { GameTimeline } from '@/components/game/GameTimeline'
import { WinnersTable } from '@/components/game/WinnersTable'
import { LiveShareStatus } from '@/components/game/LiveShareStatus'
import { SalesChart } from '@/components/game/SalesChart'

export default function Home() {
  return (
    <NavbarLayout>
      {/* Hero Section - Temporarily disabled */}
      {/* <HeroSection /> */}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PrizePoolCard />
        <UserPositionCard />
      </div>

      {/* Recent Winners */}
      <div className="mb-8">
        <WinnersTable />
      </div>

      {/* Game Progress Timeline */}
      <div className="mb-8">
        <h2 className="text-heading-2 text-text-primary mb-6">Game Progress</h2>
        <GameTimeline />
      </div>

      {/* Live Stats Section - Below Game Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <LiveShareStatus />
        <SalesChart />
      </div>

      {/* Quick Info */}
      <div className="mt-8 card">
        <h3 className="text-heading-3 text-text-primary mb-4">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-bg-hover">
            <div className="text-display-2 font-bold text-accent-primary/20 mb-2">01</div>
            <h4 className="text-body-md font-medium text-text-primary mb-1">Buy Shares</h4>
            <p className="text-body-sm text-text-secondary">Purchase shares with LUSD to enter the game</p>
          </div>
          <div className="p-4 rounded-lg bg-bg-hover">
            <div className="text-display-2 font-bold text-accent-primary/20 mb-2">02</div>
            <h4 className="text-body-md font-medium text-text-primary mb-1">Random Selection</h4>
            <p className="text-body-sm text-text-secondary">8 participants are randomly selected</p>
          </div>
          <div className="p-4 rounded-lg bg-bg-hover">
            <div className="text-display-2 font-bold text-accent-primary/20 mb-2">03</div>
            <h4 className="text-body-md font-medium text-text-primary mb-1">Vote Rounds</h4>
            <p className="text-body-sm text-text-secondary">Vote to continue or stop (8→4→2)</p>
          </div>
          <div className="p-4 rounded-lg bg-bg-hover">
            <div className="text-display-2 font-bold text-accent-primary/20 mb-2">04</div>
            <h4 className="text-body-md font-medium text-text-primary mb-1">Win Prize</h4>
            <p className="text-body-sm text-text-secondary">Final winner receives 85% of the pool</p>
          </div>
        </div>
      </div>
    </NavbarLayout>
  )
}
