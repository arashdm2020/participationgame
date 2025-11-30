'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Github, Twitter, MessageCircle } from 'lucide-react'

interface FooterProps {
  locale: string
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations()
  const isRTL = locale === 'fa'

  return (
    <footer className="border-t border-slate-700/50 bg-slate-900/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                <span className="text-xl">🏆</span>
              </div>
              <span className="text-xl font-bold text-white">
                {t('common.appName')}
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-md">
              {t('common.tagline')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">
              {isRTL ? 'لینک‌ها' : 'Links'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/how-it-works"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {t('nav.howItWorks')}
                </Link>
              </li>
              <li>
                <Link
                  href="/winners"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {t('nav.winners')}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {t('nav.faq')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-white mb-4">
              {isRTL ? 'شبکه‌های اجتماعی' : 'Social'}
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-700/50 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} Participation Game. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
