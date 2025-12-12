'use client'

import { Navbar } from './Navbar'

interface NavbarLayoutProps {
  children: React.ReactNode
}

export function NavbarLayout({ children }: NavbarLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-root">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  )
}
