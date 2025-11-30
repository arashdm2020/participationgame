'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Menu, X, Globe, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HeaderProps {
  locale: string
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isRTL = locale === 'fa'

  const navItems = [
    { href: '/', label: t('nav.home') },
    { href: '/how-it-works', label: t('nav.howItWorks') },
    { href: '/winners', label: t('nav.winners') },
    { href: '/faq', label: t('nav.faq') },
  ]

  const toggleLocale = () => {
    const newLocale = locale === 'fa' ? 'en' : 'fa'
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`
    window.location.reload()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
              <span className="text-xl">🏆</span>
            </div>
            <span className="text-xl font-bold text-white">
              {t('common.appName')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors rounded-lg hover:bg-slate-800/50"
            >
              {t('nav.dashboard')}
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLocale}
              className="hidden sm:flex"
            >
              <Globe className="h-5 w-5" />
              <span className="sr-only">Toggle language</span>
            </Button>

            {/* Connect Wallet */}
            <div className="hidden sm:block">
              <ConnectButton
                chainStatus="icon"
                showBalance={false}
                accountStatus={{
                  smallScreen: 'avatar',
                  largeScreen: 'full',
                }}
              />
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700/50">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-3 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/dashboard"
                className="px-4 py-3 text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors rounded-lg hover:bg-slate-800/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.dashboard')}
              </Link>
              <div className="px-4 py-3 flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={toggleLocale}>
                  <Globe className="h-4 w-4 mr-2" />
                  {locale === 'fa' ? 'English' : 'فارسی'}
                </Button>
                <ConnectButton chainStatus="icon" showBalance={false} />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
