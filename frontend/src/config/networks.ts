// Network Configuration
// Easily switch between testnet and mainnet

export interface NetworkConfig {
  id: number
  name: string
  rpcUrl: string
  blockExplorer: string
  contractAddress: `0x${string}`
  lusdAddress: `0x${string}`
  vrfCoordinator: `0x${string}`
  isTestnet: boolean
}

export const networks: Record<'testnet' | 'mainnet', NetworkConfig> = {
  testnet: {
    id: 421614,
    name: 'Arbitrum Sepolia',
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    blockExplorer: 'https://sepolia.arbiscan.io',
    // Deployed contract addresses on Arbitrum Sepolia
    contractAddress: '0xd98b85650Fa30d849217e540A563D26Eb21f8E46',
    lusdAddress: '0x8d13F248f3D7be222FF5E9743E392C76948C1028',
    vrfCoordinator: '0x50d47e4142598E3411aA864e08a44284e471AC6f',
    isTestnet: true,
  },
  mainnet: {
    id: 42161,
    name: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
    // TODO: Replace with actual deployed contract address
    contractAddress: '0x0000000000000000000000000000000000000000',
    // LUSD on Arbitrum Mainnet
    lusdAddress: '0x93b346b6BC2548dA6A1E7d98E9a421B42541425b',
    vrfCoordinator: '0x41034678D6C633D8a95c75e1138A360a28bA15d1',
    isTestnet: false,
  },
}

// Default to testnet during development
export const DEFAULT_NETWORK: 'testnet' | 'mainnet' = 'testnet'

export function getNetwork(isMainnet: boolean = false): NetworkConfig {
  return isMainnet ? networks.mainnet : networks.testnet
}

export function getNetworkById(chainId: number): NetworkConfig | undefined {
  return Object.values(networks).find((n) => n.id === chainId)
}
