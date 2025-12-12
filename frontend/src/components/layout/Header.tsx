'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useChainId } from 'wagmi'
import { useGameStatus } from '@/lib/hooks'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const GAME_STATUS_CONFIG: Record<number, { label: string; variant: string }> = {
  0: { label: 'Buying Open', variant: 'badge-success' },
  1: { label: 'Cap Reached', variant: 'badge-warning' },
  2: { label: 'Requesting VRF...', variant: 'badge-warning' },
  3: { label: 'Eliminating...', variant: 'badge-warning' },
  4: { label: 'Voting (8)', variant: 'badge-info' },
  5: { label: 'Voting (4)', variant: 'badge-info' },
  6: { label: 'Final Vote (2)', variant: 'badge-info' },
  7: { label: 'Finished', variant: 'badge-success' },
}

export function Header() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { status } = useGameStatus()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isCorrectNetwork = chainId === 421614 // Arbitrum Sepolia
  const statusConfig = GAME_STATUS_CONFIG[status] || GAME_STATUS_CONFIG[0]

  return (
    <header className="fixed top-0 right-0 left-[240px] h-16 bg-bg-surface border-b border-border-subtle z-30 lg:left-[240px]">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left: Game Status */}
        <div className="flex items-center gap-4">
          <div className={statusConfig.variant}>
            <span className="status-dot-success" />
            {statusConfig.label}
          </div>
        </div>

        {/* Right: Network + Wallet */}
        <div className="flex items-center gap-3">
          {/* Network Badge */}
          {isConnected && (
            <div className={isCorrectNetwork ? 'badge-success' : 'badge-danger'}>
              <span className={isCorrectNetwork ? 'status-dot-success' : 'status-dot-danger'} />
              {isCorrectNetwork ? 'Arbitrum' : 'Wrong Network'}
            </div>
          )}

          {/* Connect Wallet */}
          <ConnectButton
            chainStatus="none"
            showBalance={false}
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
          />

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden btn-ghost p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  )
}
