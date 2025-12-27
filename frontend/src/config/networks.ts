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
    contractAddress: '0xF4Abd3F1eF0298fd3f02908114Fd139b6750d6c6',
    lusdAddress: '0xCc4Ad4856222044Af187E7275820BC4367A0FDdF',
    vrfCoordinator: '0x5CE8D5A2BC84beb22a398CCA51996F7930313D61',
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
