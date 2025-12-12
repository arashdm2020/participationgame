'use client'

import dynamic from 'next/dynamic'

const Web3Provider = dynamic(
  () => import('./Web3Provider').then((mod) => mod.Web3Provider),
  { ssr: false }
)

interface ClientProvidersProps {
  children: React.ReactNode
  locale?: string
}

export function ClientProviders({ children, locale }: ClientProvidersProps) {
  return (
    <Web3Provider locale={locale}>
      {children}
    </Web3Provider>
  )
}
