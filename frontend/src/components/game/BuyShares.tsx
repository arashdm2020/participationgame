'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Plus, Minus, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { PARTICIPATION_GAME_ABI, ERC20_ABI } from '@/config/contracts'
import { formatLUSD } from '@/lib/utils'
import { useContractData } from '@/lib/hooks'
import { useQueryClient } from '@tanstack/react-query'

export function BuyShares() {
  const t = useTranslations('game.buy')
  const { address, isConnected, chain } = useAccount()
  const [amount, setAmount] = useState(1)
  const { contractAddress, lusdAddress, lusdBalance, lusdAllowance } = useContractData()
  const queryClient = useQueryClient()

  const sharePrice = parseEther('1') // 1 LUSD per share
  const quickAmounts = [10, 20, 50, 100]

  // Check if on correct network (Arbitrum Sepolia = 421614)
  const isWrongNetwork = chain?.id !== 421614

  // Approve LUSD
  const { writeContract: approve, isPending: isApproving, data: approveHash } = useWriteContract()
  const { isLoading: isWaitingApprove, isSuccess: approveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  })

  // Buy shares
  const { writeContract: buyShares, isPending: isBuying, data: buyHash } = useWriteContract()
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

  const incrementAmount = () => setAmount(prev => prev + 1)
  const decrementAmount = () => setAmount(prev => Math.max(1, prev - 1))

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShoppingCart className="h-5 w-5 text-amber-500" />
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amount Selector */}
        <div className="space-y-2">
          <label className="text-sm text-slate-400">{t('amount')}</label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={decrementAmount}
              disabled={amount <= 1}
              className="h-10 w-10 rounded-lg bg-red-500/20 border-red-500/50 hover:bg-red-500/30"
            >
              <Minus className="h-4 w-4 text-red-400" />
            </Button>
            <div className="flex-1">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-center text-2xl font-bold bg-slate-700/50 border border-slate-600 rounded-lg py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={incrementAmount}
              className="h-10 w-10 rounded-lg bg-green-500/20 border-green-500/50 hover:bg-green-500/30"
            >
              <Plus className="h-4 w-4 text-green-400" />
            </Button>
          </div>
        </div>

        {/* Quick Select */}
        <div className="grid grid-cols-4 gap-2">
          {quickAmounts.map((qty) => (
            <Button
              key={qty}
              variant={amount === qty ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setAmount(qty)}
              className="text-sm"
            >
              {qty}
            </Button>
          ))}
        </div>

        {/* Total Cost */}
        <div className="p-3 rounded-xl bg-slate-700/30 border border-slate-600">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">{t('totalCost')}</span>
            <span className="text-xl font-bold text-green-400">
              {amount} LUSD
            </span>
          </div>
        </div>

        {/* Wrong Network Warning */}
        {isWrongNetwork && isConnected && (
          <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <span className="text-red-400 text-sm">{t('wrongNetwork')}</span>
          </div>
        )}

        {/* Success Messages */}
        {approveSuccess && !needsApproval && (
          <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/50 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
            <span className="text-green-400 text-sm">{t('approved')}</span>
          </div>
        )}

        {buySuccess && (
          <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/50 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
            <span className="text-green-400 text-sm">{t('purchaseSuccess')}</span>
          </div>
        )}

        {/* Action Button */}
        {!isConnected ? (
          <Button className="w-full" size="lg" disabled>
            {t('connectWallet')}
          </Button>
        ) : isWrongNetwork ? (
          <Button className="w-full" size="lg" variant="destructive" disabled>
            {t('switchNetwork')}
          </Button>
        ) : !hasBalance ? (
          <Button className="w-full" size="lg" variant="destructive" disabled>
            {t('insufficientBalance')}
          </Button>
        ) : needsApproval ? (
          <Button
            className="w-full"
            size="lg"
            onClick={handleApprove}
            disabled={isApproving || isWaitingApprove}
          >
            {(isApproving || isWaitingApprove) && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isWaitingApprove ? t('waitingApproval') : t('approveFirst')}
          </Button>
        ) : (
          <Button
            className="w-full"
            size="lg"
            onClick={handleBuy}
            disabled={isBuying || isWaitingBuy}
          >
            {(isBuying || isWaitingBuy) && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isWaitingBuy ? t('processing') : t('buyButton', { amount })}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
