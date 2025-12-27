'use client'

import { useState, useEffect } from 'react'
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
  Wallet,
  ShoppingCart,
  Sparkles
} from 'lucide-react'

const QUICK_AMOUNTS = [10, 25, 50, 100]

export function BuySharesInline() {
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
  const { writeContract: buyShares, isPending: isBuyingTx, data: buyHash } = useWriteContract()
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

  // Not in buying phase
  if (!isBuying) {
    return (
      <div className="card">
        <div className="flex items-center gap-2 mb-4 text-text-secondary">
          <ShoppingCart className="w-5 h-5" />
          <span className="text-body-sm font-medium">Buy Shares</span>
        </div>
        <div className="text-center py-6">
          <AlertCircle className="w-12 h-12 text-status-warning mx-auto mb-3" />
          <p className="text-body-md text-text-secondary">
            Buying phase has ended. Wait for the next round.
          </p>
        </div>
      </div>
    )
  }

  // Not connected
  if (!isConnected) {
    return (
      <div className="card">
        <div className="flex items-center gap-2 mb-4 text-text-secondary">
          <ShoppingCart className="w-5 h-5" />
          <span className="text-body-sm font-medium">Buy Shares</span>
        </div>
        <div className="text-center py-6">
          <Wallet className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
          <p className="text-body-md text-text-secondary">
            Connect wallet to buy shares
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card-highlighted">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-text-secondary">
          <ShoppingCart className="w-5 h-5 text-accent-primary" />
          <span className="text-body-sm font-medium">Buy Shares</span>
        </div>
        <span className="badge-success">
          <Sparkles className="w-3 h-3" />
          Open
        </span>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAmount(prev => Math.max(1, prev - 1))}
            disabled={amount <= 1}
            className="btn-secondary p-2 disabled:opacity-30"
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
            className="input text-center flex-1 text-lg font-mono"
          />
          <button
            onClick={() => setAmount(prev => prev + 1)}
            className="btn-secondary p-2"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Select */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {QUICK_AMOUNTS.map((qty) => (
          <button
            key={qty}
            onClick={() => setAmount(qty)}
            className={`py-1.5 px-2 rounded-lg text-sm font-medium transition-colors ${
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
      <div className="p-3 rounded-lg bg-bg-hover mb-4 space-y-2">
        <div className="flex justify-between text-body-sm">
          <span className="text-text-secondary">Cost</span>
          <span className="text-text-primary font-mono">{amount} LUSD</span>
        </div>
        <div className="flex justify-between text-body-sm">
          <span className="text-text-secondary">To prize pool (90%)</span>
          <span className="text-accent-primary font-mono">{(amount * 0.9).toFixed(1)} LUSD</span>
        </div>
      </div>

      {/* Balance */}
      <div className="flex items-center justify-between mb-4 text-body-sm">
        <span className="text-text-secondary">Your balance:</span>
        <span className="font-mono text-text-primary">{balanceFormatted} LUSD</span>
      </div>

      {/* Alerts */}
      {isWrongNetwork && (
        <div className="p-3 rounded-lg bg-status-danger-bg border border-status-danger/30 mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-status-danger flex-shrink-0" />
          <span className="text-body-sm text-status-danger">Switch to Arbitrum</span>
        </div>
      )}

      {approveSuccess && !needsApproval && (
        <div className="p-3 rounded-lg bg-status-success-bg border border-status-success/30 mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-status-success flex-shrink-0" />
          <span className="text-body-sm text-status-success">LUSD approved!</span>
        </div>
      )}

      {buySuccess && (
        <div className="p-3 rounded-lg bg-status-success-bg border border-status-success/30 mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-status-success flex-shrink-0" />
          <span className="text-body-sm text-status-success">Purchased {amount} shares!</span>
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
          disabled={isBuyingTx || isWaitingBuy}
        >
          {(isBuyingTx || isWaitingBuy) && <Loader2 className="w-4 h-4 animate-spin" />}
          {isWaitingBuy ? 'Processing...' : `Buy ${amount} Shares`}
        </button>
      )}
    </div>
  )
}
