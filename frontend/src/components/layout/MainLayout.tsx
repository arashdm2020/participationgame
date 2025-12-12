'use client'

import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-root">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="ml-[240px] pt-16 min-h-screen">
        <div className="p-6 max-w-[1200px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
