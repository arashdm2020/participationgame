'use client'

import { Trophy, Zap, Shield } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-12 md:py-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-transparent to-accent-secondary/10 pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto text-center px-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-secondary border border-border-primary mb-6 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
          <span className="text-body-sm text-text-secondary">Live on Arbitrum Sepolia</span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4 animate-slide-up">
          Decentralized
          <span className="text-accent-primary"> Participation </span>
          Game
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          Buy shares, participate in voting rounds, and win the prize pool. 
          Fully transparent and verifiable on-chain.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Link 
            href="/buy" 
            className="btn-primary px-8 py-3 text-lg font-semibold flex items-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Buy Shares Now
          </Link>
          <Link 
            href="#how-it-works" 
            className="btn-secondary px-8 py-3 text-lg font-semibold"
          >
            How It Works
          </Link>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-lg bg-accent-primary/20">
              <Trophy className="w-5 h-5 text-accent-primary" />
            </div>
            <div className="text-heading-3 text-text-primary">85%</div>
            <div className="text-body-sm text-text-tertiary">Winner Prize</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-lg bg-status-success/20">
              <Shield className="w-5 h-5 text-status-success" />
            </div>
            <div className="text-heading-3 text-text-primary">VRF</div>
            <div className="text-body-sm text-text-tertiary">Chainlink</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-lg bg-accent-secondary/20">
              <Zap className="w-5 h-5 text-accent-secondary" />
            </div>
            <div className="text-heading-3 text-text-primary">L2</div>
            <div className="text-body-sm text-text-tertiary">Arbitrum</div>
          </div>
        </div>
      </div>
    </section>
  )
}
