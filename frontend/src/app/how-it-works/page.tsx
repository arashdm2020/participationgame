'use client'

import { NavbarLayout } from '@/components/layout/NavbarLayout'
import Link from 'next/link'

export default function HowItWorksPage() {
  return (
    <NavbarLayout>
      <div className="max-w-[800px] mx-auto">
        
        {/* Header */}
        <header className="mb-12 pt-8">
          <h1 className="text-h1 text-white-primary mb-3">Game Rules</h1>
          <p className="text-body text-white-secondary">
            Understand the mechanics before you participate.
          </p>
        </header>

        {/* Overview */}
        <section className="mb-12">
          <div className="panel p-6 mb-6">
            <div className="label label-gold mb-4">Summary</div>
            <p className="text-body text-white-secondary leading-relaxed">
              Participation is a prize pool game. Players buy shares, 8 are randomly selected, 
              and through voting rounds the field narrows until one winner takes the pool.
            </p>
          </div>
        </section>

        {/* Phase 1: Buying */}
        <section className="mb-10">
          <div className="flex items-baseline gap-4 mb-4">
            <span className="text-gold font-mono text-caption">01</span>
            <h2 className="text-h2 text-white-primary">Buying Phase</h2>
          </div>
          <div className="border-l border-white-ghost pl-6 ml-2">
            <ul className="space-y-3 text-body text-white-secondary">
              <li>Each share costs <span className="text-white-primary font-mono">1 LUSD</span></li>
              <li>Buy any number of shares — no limit per wallet</li>
              <li>90% goes to prize pool, 10% platform fee</li>
              <li>Buying closes when the token cap is reached</li>
            </ul>
          </div>
        </section>

        {/* Phase 2: Selection */}
        <section className="mb-10">
          <div className="flex items-baseline gap-4 mb-4">
            <span className="text-gold font-mono text-caption">02</span>
            <h2 className="text-h2 text-white-primary">Random Selection</h2>
          </div>
          <div className="border-l border-white-ghost pl-6 ml-2">
            <ul className="space-y-3 text-body text-white-secondary">
              <li>Chainlink VRF generates verifiable random numbers</li>
              <li><span className="text-white-primary">8 participants</span> are selected</li>
              <li>Selection is weighted by share count — more shares = higher chance</li>
              <li>All randomness is on-chain and auditable</li>
            </ul>
          </div>
        </section>

        {/* Phase 3: Voting - CRITICAL SECTION */}
        <section className="mb-10">
          <div className="flex items-baseline gap-4 mb-4">
            <span className="text-gold font-mono text-caption">03</span>
            <h2 className="text-h2 text-white-primary">Voting Rounds</h2>
          </div>
          <div className="border-l border-gold/50 pl-6 ml-2">
            <div className="panel-gold p-5 mb-4">
              <div className="label label-gold mb-2">Important</div>
              <p className="text-body-sm text-white-secondary">
                Only the 8 selected participants can vote. Voting determines whether to continue 
                eliminating or stop and pick a winner immediately.
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="text-h4 text-white-primary mb-2">Round 1: 8 → 4</div>
                <p className="text-body-sm text-white-secondary">
                  If majority votes <span className="text-gold">Continue</span>: 4 are randomly eliminated, 4 remain.
                  <br />
                  If majority votes <span className="text-white-primary">Stop</span>: Winner selected from current 8.
                </p>
              </div>
              
              <div>
                <div className="text-h4 text-white-primary mb-2">Round 2: 4 → 2</div>
                <p className="text-body-sm text-white-secondary">
                  If majority votes <span className="text-gold">Continue</span>: 2 are randomly eliminated, 2 remain.
                  <br />
                  If majority votes <span className="text-white-primary">Stop</span>: Winner selected from current 4.
                </p>
              </div>
              
              <div>
                <div className="text-h4 text-white-primary mb-2">Round 3: 2 → 1</div>
                <p className="text-body-sm text-white-secondary">
                  Final round. One of the two remaining is randomly selected as winner.
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-white-ghost/50">
              <div className="text-caption text-white-tertiary mb-2">VOTE TIMEOUT</div>
              <p className="text-body-sm text-white-secondary">
                Each voting round has a time limit. If a participant doesn't vote, 
                their default vote is <span className="text-gold">Continue</span>.
              </p>
            </div>
          </div>
        </section>

        {/* Phase 4: Prize */}
        <section className="mb-10">
          <div className="flex items-baseline gap-4 mb-4">
            <span className="text-gold font-mono text-caption">04</span>
            <h2 className="text-h2 text-white-primary">Prize Distribution</h2>
          </div>
          <div className="border-l border-white-ghost pl-6 ml-2">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="panel p-4">
                <div className="label mb-1">Winner</div>
                <div className="text-display-md value-display value-gold">85%</div>
                <div className="text-caption text-white-tertiary mt-1">of prize pool</div>
              </div>
              <div className="panel p-4">
                <div className="label mb-1">Consolation</div>
                <div className="text-display-md value-display">5%</div>
                <div className="text-caption text-white-tertiary mt-1">split among runners-up</div>
              </div>
            </div>
            <p className="text-body-sm text-white-tertiary">
              Remaining 10% was collected as platform fee during buying phase.
            </p>
          </div>
        </section>

        {/* Key Facts */}
        <section className="mb-12">
          <div className="divider-gold mb-8" />
          <h2 className="text-h3 text-white-primary mb-6">Key Facts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="panel p-4">
              <div className="text-body-sm text-white-secondary mb-1">Randomness</div>
              <div className="text-body text-white-primary">Chainlink VRF</div>
            </div>
            <div className="panel p-4">
              <div className="text-body-sm text-white-secondary mb-1">Network</div>
              <div className="text-body text-white-primary">Arbitrum Sepolia</div>
            </div>
            <div className="panel p-4">
              <div className="text-body-sm text-white-secondary mb-1">Currency</div>
              <div className="text-body text-white-primary">LUSD (Stablecoin)</div>
            </div>
            <div className="panel p-4">
              <div className="text-body-sm text-white-secondary mb-1">Smart Contract</div>
              <div className="text-body text-white-primary">Fully On-chain</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pb-12">
          <Link href="/" className="btn btn-gold btn-lg">
            Enter Game
          </Link>
        </section>

      </div>
    </NavbarLayout>
  )
}
