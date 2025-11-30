import { http } from 'wagmi'
import { arbitrumSepolia } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

// Block Explorer URL for Arbitrum Sepolia
export const BLOCK_EXPLORER = 'https://sepolia.arbiscan.io'

// RainbowKit + Wagmi Configuration
// Currently configured for Arbitrum Sepolia Testnet only
export const config = getDefaultConfig({
  appName: 'Participation Game',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: http('https://sepolia-rollup.arbitrum.io/rpc'),
  },
  ssr: true,
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
