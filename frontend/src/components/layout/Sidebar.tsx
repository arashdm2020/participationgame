'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { useContractData } from '@/lib/hooks'
import {
  LayoutDashboard,
  PlusCircle,
  Vote,
  User,
  Trophy,
  Shield,
  HelpCircle,
  Settings,
} from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  adminOnly?: boolean
}

const mainNavItems: NavItem[] = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/buy', label: 'Buy Shares', icon: PlusCircle },
  { href: '/vote', label: 'Voting', icon: Vote },
  { href: '/stats', label: 'My Stats', icon: User },
  { href: '/winners', label: 'Winners', icon: Trophy },
]

const adminNavItems: NavItem[] = [
  { href: '/admin', label: 'Control Panel', icon: Shield, adminOnly: true },
]

const footerNavItems: NavItem[] = [
  { href: '/how-it-works', label: 'How It Works', icon: HelpCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const { address } = useAccount()
  
  // For now, we'll show admin to all connected users
  // In production, this should check isOperator or isOwner
  const showAdmin = !!address

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-bg-root border-r border-border-subtle flex flex-col z-40">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-border-subtle">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-emerald-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-semibold text-text-primary">Participation</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="mb-2 px-3 text-body-sm text-text-tertiary uppercase tracking-wider">
          Main
        </div>
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? 'nav-item-active' : 'nav-item'}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}

        {/* Admin Section */}
        {showAdmin && (
          <>
            <div className="mt-6 mb-2 px-3 text-body-sm text-text-tertiary uppercase tracking-wider">
              Admin
            </div>
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive ? 'nav-item-active' : 'nav-item'}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* Footer Navigation */}
      <div className="py-4 px-3 border-t border-border-subtle space-y-1">
        {footerNavItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? 'nav-item-active' : 'nav-item'}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
