import { http } from 'wagmi'
import { arbitrumSepolia } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

// Block Explorer URL for Arbitrum Sepolia
export const BLOCK_EXPLORER = 'https://sepolia.arbiscan.io'

// RainbowKit + Wagmi Configuration
// Currently configured for Arbitrum Sepolia Testnet only
// Using Alchemy RPC for CORS support in browser
const ARBITRUM_SEPOLIA_RPC = process.env.NEXT_PUBLIC_RPC_URL || 'https://arb-sepolia.g.alchemy.com/v2/demo'

export const config = getDefaultConfig({
  appName: 'Participation Game',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: http(ARBITRUM_SEPOLIA_RPC),
  },
  ssr: true,
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
