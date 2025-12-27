'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useChainId } from 'wagmi'
import { useGameStatus } from '@/lib/hooks'

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard' },
  { href: '/vote', label: 'Vote' },
  { href: '/winners', label: 'Winners' },
  { href: '/stats', label: 'Position' },
  { href: '/how-it-works', label: 'Rules' },
]

const GAME_PHASE: Record<number, string> = {
  0: 'OPEN',
  1: 'CAP',
  2: 'VRF',
  3: 'ELIM',
  4: 'VOTE·8',
  5: 'VOTE·4',
  6: 'VOTE·2',
  7: 'END',
}

export function Navbar() {
  const pathname = usePathname()
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { status } = useGameStatus()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isCorrectNetwork = chainId === 421614
  const phase = GAME_PHASE[status] || 'OPEN'

  return (
    <header className="sticky top-0 z-50 w-full bg-base border-b border-white-ghost">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
        <div className="flex h-14 items-center justify-between">
          
          {/* Left: Logo + Phase */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-gold font-mono text-lg tracking-tight">P</span>
              <span className="text-white-primary text-body font-medium hidden sm:block">
                Participation
              </span>
            </Link>
            
            {/* Phase Indicator */}
            <div className="indicator-live text-caption">
              {phase}
            </div>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 text-body-sm transition-colors duration-fast ${
                    isActive
                      ? 'text-gold'
                      : 'text-white-tertiary hover:text-white-primary'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right: Network + Wallet */}
          <div className="flex items-center gap-3">
            {/* Network Status */}
            {isConnected && (
              <div className={`hidden md:flex text-caption font-mono ${
                isCorrectNetwork ? 'text-white-secondary' : 'text-gold'
              }`}>
                {isCorrectNetwork ? 'ARB' : 'SWITCH'}
              </div>
            )}

            {/* Wallet */}
            <ConnectButton.Custom>
              {({ account, chain, openConnectModal, openAccountModal, mounted }) => {
                const connected = mounted && account && chain
                
                return (
                  <button
                    onClick={connected ? openAccountModal : openConnectModal}
                    className={`btn btn-sm ${connected ? 'btn-outline' : 'btn-gold'}`}
                  >
                    {connected ? (
                      <span className="font-mono text-caption">
                        {account.displayName}
                      </span>
                    ) : (
                      'Connect'
                    )}
                  </button>
                )
              }}
            </ConnectButton.Custom>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-white-secondary hover:text-white-primary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                {mobileMenuOpen ? (
                  <path d="M5 5L15 15M15 5L5 15" />
                ) : (
                  <path d="M3 6H17M3 10H17M3 14H17" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white-ghost bg-surface animate-fade-in">
          <nav className="px-4 py-3">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 text-body border-b border-white-ghost last:border-0 transition-colors ${
                    isActive
                      ? 'text-gold'
                      : 'text-white-secondary'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
