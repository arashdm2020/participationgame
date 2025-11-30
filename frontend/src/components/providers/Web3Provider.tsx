'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { config } from '@/config/wagmi'
import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()

interface Web3ProviderProps {
  children: React.ReactNode
  locale?: string
}

export function Web3Provider({ children, locale = 'en' }: Web3ProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#f59e0b',
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
          })}
          locale={locale === 'fa' ? 'en' : locale as any}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
