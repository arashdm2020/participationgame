'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { ArrowLeft, Wallet, History, Gamepad2, Shield, Zap, AlertTriangle } from 'lucide-react'

interface PanelLayoutProps {
  children: React.ReactNode
  type: 'user' | 'admin'
}

const USER_NAV_ITEMS = [
  { href: '/panel', label: 'Wallet', icon: Wallet },
  { href: '/panel/history', label: 'Purchase History', icon: History },
  { href: '/panel/games', label: 'Games Participated', icon: Gamepad2 },
]

const ADMIN_NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: Shield },
  { href: '/admin/actions', label: 'Game Actions', icon: Zap },
  { href: '/admin/emergency', label: 'Emergency Controls', icon: AlertTriangle },
]

export function PanelLayout({ children, type }: PanelLayoutProps) {
  const pathname = usePathname()
  const { address } = useAccount()

  const navItems = type === 'admin' ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS
  const panelTitle = type === 'admin' ? 'ADMIN PANEL' : 'MY PANEL'
  const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''

  return (
    <div className="min-h-screen bg-bg-root flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-[260px] bg-bg-root border-r border-border-subtle flex flex-col z-40">
        {/* Back to Home */}
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-4 text-text-secondary hover:text-text-primary transition-colors border-b border-border-subtle"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-body-sm">Back to Home</span>
        </Link>

        {/* Panel Header */}
        <div className="p-5 border-b border-border-subtle bg-bg-surface">
          <div className="flex items-center gap-2 mb-1">
            {type === 'admin' && <Shield className="w-4 h-4 text-status-warning" />}
            <span className="text-body-sm font-medium text-text-secondary">{panelTitle}</span>
          </div>
          <div className="font-mono text-body-md text-text-primary">{truncatedAddress}</div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'text-text-primary bg-accent-primary-muted border-l-2 border-accent-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-border-subtle text-body-sm text-text-tertiary">
          <div>Network: Arbitrum Sepolia</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-[260px] flex-1 min-h-screen">
        <div className="max-w-5xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
