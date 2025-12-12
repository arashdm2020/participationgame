'use client'

import { useState, useEffect } from 'react'
import { NavbarLayout } from '@/components/layout/NavbarLayout'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { useContractData, useGameStatus } from '@/lib/hooks'
import { PARTICIPATION_GAME_ABI, ERC20_ABI } from '@/config/contracts'
import { useQueryClient } from '@tanstack/react-query'
import { 
  Minus, 
  Plus, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Info,
  Wallet,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

const QUICK_AMOUNTS = [10, 25, 50, 100]

export default function BuyPage() {
  const { isConnected, chain } = useAccount()
  const [amount, setAmount] = useState(10)
  const { contractAddress, lusdAddress, lusdBalance, lusdAllowance, gameDetails, gameId } = useContractData()
  const { isBuying } = useGameStatus()
  const queryClient = useQueryClient()

  const sharePrice = parseEther('1')
  const isWrongNetwork = chain?.id !== 421614

  // Approve LUSD
  const { writeContract: approve, isPending: isApproving, data: approveHash } = useWriteContract()
  const { isLoading: isWaitingApprove, isSuccess: approveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  })

  // Buy shares
  const { writeContract: buyShares, isPending: isBuying2, data: buyHash } = useWriteContract()
  const { isLoading: isWaitingBuy, isSuccess: buySuccess } = useWaitForTransactionReceipt({
    hash: buyHash,
  })

  // Refresh data after successful transactions
  useEffect(() => {
    if (approveSuccess || buySuccess) {
      queryClient.invalidateQueries()
    }
  }, [approveSuccess, buySuccess, queryClient])

  const totalCost = BigInt(amount) * sharePrice
  const needsApproval = (lusdAllowance || 0n) < totalCost
  const hasBalance = (lusdBalance || 0n) >= totalCost

  const tokenCap = gameDetails?.tokenCap || 0n
  const totalRevenue = gameDetails?.totalRevenue || 0n
  const remaining = tokenCap > totalRevenue ? tokenCap - totalRevenue : 0n
  const remainingFormatted = Number(formatEther(remaining)).toLocaleString()

  const handleApprove = () => {
    approve({
      address: lusdAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [contractAddress, totalCost],
    })
  }

  const handleBuy = () => {
    buyShares({
      address: contractAddress,
      abi: PARTICIPATION_GAME_ABI,
      functionName: 'buyShares',
      args: [totalCost, '0x0000000000000000000000000000000000000000'],
    })
  }

  const balanceFormatted = lusdBalance 
    ? Number(formatEther(lusdBalance)).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '0.00'

  // If not in buying phase
  if (!isBuying) {
    return (
      <NavbarLayout>
        <div className="max-w-lg mx-auto">
          <div className="card text-center py-12">
            <AlertCircle className="w-16 h-16 text-status-warning mx-auto mb-4" />
            <h2 className="text-heading-2 text-text-primary mb-2">Purchases Closed</h2>
            <p className="text-body-md text-text-secondary mb-6">
              The buying phase for this game has ended. Please wait for the next round.
            </p>
            <Link href="/" className="btn-secondary">
              View Game Status
            </Link>
          </div>
        </div>
      </NavbarLayout>
    )
  }

  // If not connected
  if (!isConnected) {
    return (
      <NavbarLayout>
        <div className="max-w-lg mx-auto">
          <div className="card text-center py-12">
            <Wallet className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
            <h2 className="text-heading-2 text-text-primary mb-2">Connect Wallet</h2>
            <p className="text-body-md text-text-secondary">
              Please connect your wallet to purchase shares.
            </p>
          </div>
        </div>
      </NavbarLayout>
    )
  }

  return (
    <NavbarLayout>
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-heading-1 text-text-primary mb-2">Buy Shares</h1>
          <p className="text-body-md text-text-secondary">
            Game #{gameId?.toString()} • {remainingFormatted} LUSD remaining until cap
          </p>
        </div>

        {/* Main Card */}
        <div className="card mb-6">
          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-body-sm text-text-secondary mb-3">Amount</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAmount(prev => Math.max(1, prev - 1))}
                disabled={amount <= 1}
                className="btn-secondary p-3 disabled:opacity-30"
              >
                <Minus className="w-5 h-5" />
              </button>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                className="input input-lg flex-1"
              />
              <button
                onClick={() => setAmount(prev => prev + 1)}
                className="btn-secondary p-3"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Select */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {QUICK_AMOUNTS.map((qty) => (
              <button
                key={qty}
                onClick={() => setAmount(qty)}
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  amount === qty 
                    ? 'bg-accent-primary text-white' 
                    : 'bg-bg-hover text-text-secondary hover:text-text-primary'
                }`}
              >
                {qty}
              </button>
            ))}
          </div>

          {/* Summary */}
          <div className="p-4 rounded-lg bg-bg-hover mb-6">
            <div className="space-y-3">
              <div className="flex justify-between text-body-md">
                <span className="text-text-secondary">Shares to receive</span>
                <span className="text-text-primary font-mono">{amount}</span>
              </div>
              <div className="flex justify-between text-body-md">
                <span className="text-text-secondary">Platform fee (10%)</span>
                <span className="text-text-primary font-mono">{(amount * 0.1).toFixed(1)} LUSD</span>
              </div>
              <div className="flex justify-between text-body-md">
                <span className="text-text-secondary">Added to prize pool</span>
                <span className="text-accent-primary font-mono">{(amount * 0.9).toFixed(1)} LUSD</span>
              </div>
              <div className="border-t border-border-subtle pt-3 flex justify-between">
                <span className="text-text-primary font-medium">Total Cost</span>
                <span className="text-heading-3 font-mono text-text-primary">{amount} LUSD</span>
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="flex items-center justify-between mb-6 text-body-sm">
            <span className="text-text-secondary">Your balance:</span>
            <span className="font-mono text-text-primary">{balanceFormatted} LUSD</span>
          </div>

          {/* Alerts */}
          {isWrongNetwork && (
            <div className="p-4 rounded-lg bg-status-danger-bg border border-status-danger/30 mb-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-status-danger flex-shrink-0" />
              <span className="text-body-sm text-status-danger">Please switch to Arbitrum network</span>
            </div>
          )}

          {approveSuccess && !needsApproval && (
            <div className="p-4 rounded-lg bg-status-success-bg border border-status-success/30 mb-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-status-success flex-shrink-0" />
              <span className="text-body-sm text-status-success">LUSD approved successfully!</span>
            </div>
          )}

          {buySuccess && (
            <div className="p-4 rounded-lg bg-status-success-bg border border-status-success/30 mb-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-status-success flex-shrink-0" />
              <span className="text-body-sm text-status-success">Successfully purchased {amount} shares!</span>
            </div>
          )}

          {/* Action Button */}
          {isWrongNetwork ? (
            <button className="btn-danger w-full" disabled>
              Switch to Arbitrum
            </button>
          ) : !hasBalance ? (
            <button className="btn-danger w-full" disabled>
              Insufficient Balance
            </button>
          ) : needsApproval ? (
            <button
              className="btn-primary w-full"
              onClick={handleApprove}
              disabled={isApproving || isWaitingApprove}
            >
              {(isApproving || isWaitingApprove) && <Loader2 className="w-4 h-4 animate-spin" />}
              {isWaitingApprove ? 'Confirming...' : 'Approve LUSD'}
            </button>
          ) : (
            <button
              className="btn-primary w-full"
              onClick={handleBuy}
              disabled={isBuying2 || isWaitingBuy}
            >
              {(isBuying2 || isWaitingBuy) && <Loader2 className="w-4 h-4 animate-spin" />}
              {isWaitingBuy ? 'Processing...' : `Buy ${amount} Shares`}
              {!isBuying2 && !isWaitingBuy && <ArrowRight className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Info Card */}
        <div className="card">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-status-info flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-body-sm text-text-secondary">
              <p>• 1 LUSD = 1 share</p>
              <p>• More shares = higher chance of selection</p>
              <p>• 85% of the prize pool goes to the final winner</p>
              <p>• Excess funds roll over to the next game automatically</p>
            </div>
          </div>
        </div>
      </div>
    </NavbarLayout>
  )
}
