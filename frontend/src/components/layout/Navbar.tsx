'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useChainId } from 'wagmi'
import { useGameStatus } from '@/lib/hooks'
import { Menu, X, User } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/buy', label: 'Buy Shares' },
  { href: '/vote', label: 'Voting' },
  { href: '/winners', label: 'Winners' },
  { href: '/how-it-works', label: 'How It Works' },
]

const GAME_STATUS_CONFIG: Record<number, { label: string; variant: string }> = {
  0: { label: 'Buying Open', variant: 'badge-success' },
  1: { label: 'Cap Reached', variant: 'badge-warning' },
  2: { label: 'VRF Pending', variant: 'badge-warning' },
  3: { label: 'Eliminating', variant: 'badge-warning' },
  4: { label: 'Voting (8)', variant: 'badge-info' },
  5: { label: 'Voting (4)', variant: 'badge-info' },
  6: { label: 'Final Vote', variant: 'badge-info' },
  7: { label: 'Finished', variant: 'badge-success' },
}

export function Navbar() {
  const pathname = usePathname()
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { status } = useGameStatus()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isCorrectNetwork = chainId === 421614
  const statusConfig = GAME_STATUS_CONFIG[status] || GAME_STATUS_CONFIG[0]

  return (
    <header className="sticky top-0 z-50 w-full bg-bg-surface border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-semibold text-text-primary hidden sm:block">
                Participation
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-body-md transition-colors ${
                      isActive
                        ? 'text-accent-primary bg-accent-primary-muted'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right: Status + Network + Wallet + Panel */}
          <div className="flex items-center gap-3">
            {/* Game Status Pill */}
            <div className={`hidden sm:flex ${statusConfig.variant}`}>
              <span className="status-dot-success" />
              {statusConfig.label}
            </div>

            {/* Network Badge */}
            {isConnected && (
              <div className={`hidden md:flex ${isCorrectNetwork ? 'badge-success' : 'badge-danger'}`}>
                <span className={isCorrectNetwork ? 'status-dot-success' : 'status-dot-danger'} />
                {isCorrectNetwork ? 'Arbitrum' : 'Wrong Network'}
              </div>
            )}

            {/* Wallet */}
            <ConnectButton
              chainStatus="none"
              showBalance={false}
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full',
              }}
            />

            {/* Panel Link (when connected) */}
            {isConnected && (
              <Link
                href="/panel"
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
                title="My Panel"
              >
                <User className="w-5 h-5" />
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border-subtle bg-bg-surface">
          <nav className="px-4 py-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-body-md transition-colors ${
                    isActive
                      ? 'text-accent-primary bg-accent-primary-muted'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {isConnected && (
              <Link
                href="/panel"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-body-md text-text-secondary hover:text-text-primary hover:bg-bg-hover"
              >
                My Panel
              </Link>
            )}
          </nav>
          
          {/* Mobile Status */}
          <div className="px-4 pb-4 flex items-center gap-2">
            <div className={statusConfig.variant}>
              <span className="status-dot-success" />
              {statusConfig.label}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
