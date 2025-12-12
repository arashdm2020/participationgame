'use client'

import { PanelLayout } from '@/components/layout/PanelLayout'
import { useAccount, useChainId } from 'wagmi'
import { useContractData } from '@/lib/hooks'
import { formatEther } from 'viem'
import { Copy, Check, Wallet, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function UserPanelPage() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { lusdBalance, lusdAllowance, contractAddress } = useContractData()
  const [copied, setCopied] = useState(false)

  const isCorrectNetwork = chainId === 421614
  const networkName = isCorrectNetwork ? 'Arbitrum Sepolia' : 'Wrong Network'

  const balanceFormatted = lusdBalance 
    ? Number(formatEther(lusdBalance)).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '0.00'

  const allowanceFormatted = lusdAllowance 
    ? Number(formatEther(lusdAllowance)).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '0.00'

  const handleCopy = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isConnected) {
    return (
      <PanelLayout type="user">
        <div className="max-w-lg mx-auto">
          <div className="card text-center py-12">
            <Wallet className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
            <h2 className="text-heading-2 text-text-primary mb-2">Connect Wallet</h2>
            <p className="text-body-md text-text-secondary mb-6">
              Please connect your wallet to access your panel.
            </p>
            <Link href="/" className="btn-secondary">
              Go to Home
            </Link>
          </div>
        </div>
      </PanelLayout>
    )
  }

  return (
    <PanelLayout type="user">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-heading-1 text-text-primary mb-2">Wallet Details</h1>
        <p className="text-body-md text-text-secondary">
          Your connected wallet and token balances
        </p>
      </div>

      {/* Wallet Details Card */}
      <div className="card mb-6">
        {/* Address */}
        <div className="mb-6">
          <label className="block text-body-sm text-text-secondary mb-2">Address</label>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-bg-hover">
            <code className="flex-1 font-mono text-body-md text-text-primary break-all">
              {address}
            </code>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
              title="Copy address"
            >
              {copied ? <Check className="w-4 h-4 text-status-success" /> : <Copy className="w-4 h-4" />}
            </button>
            <a
              href={`https://sepolia.arbiscan.io/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
              title="View on explorer"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Network */}
        <div className="mb-6">
          <label className="block text-body-sm text-text-secondary mb-2">Network</label>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isCorrectNetwork ? 'bg-status-success' : 'bg-status-danger'}`} />
            <span className={`text-body-md ${isCorrectNetwork ? 'text-text-primary' : 'text-status-danger'}`}>
              {networkName}
            </span>
          </div>
        </div>

        <div className="border-t border-border-subtle pt-6">
          <div className="grid grid-cols-2 gap-6">
            {/* LUSD Balance */}
            <div>
              <label className="block text-body-sm text-text-secondary mb-2">LUSD Balance</label>
              <div className="text-display-2 font-mono text-text-primary">{balanceFormatted}</div>
              <div className="text-body-sm text-text-tertiary">LUSD</div>
            </div>

            {/* LUSD Allowance */}
            <div>
              <label className="block text-body-sm text-text-secondary mb-2">LUSD Allowance</label>
              <div className="text-display-2 font-mono text-text-primary">{allowanceFormatted}</div>
              <div className="text-body-sm text-text-tertiary">LUSD approved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/panel/history" className="card hover:border-accent-primary/50 transition-colors">
          <h3 className="text-heading-3 text-text-primary mb-1">Purchase History</h3>
          <p className="text-body-sm text-text-secondary">View all your share purchases</p>
        </Link>
        <Link href="/panel/games" className="card hover:border-accent-primary/50 transition-colors">
          <h3 className="text-heading-3 text-text-primary mb-1">Games Participated</h3>
          <p className="text-body-sm text-text-secondary">Track your game participation</p>
        </Link>
      </div>
    </PanelLayout>
  )
}
