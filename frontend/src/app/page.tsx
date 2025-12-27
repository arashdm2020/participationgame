'use client'

import { useState, useEffect } from 'react'
import { NavbarLayout } from '@/components/layout/NavbarLayout'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { useContractData, useGameStatus } from '@/lib/hooks'
import { PARTICIPATION_GAME_ABI, ERC20_ABI } from '@/config/contracts'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'

export default function Home() {
  const { isConnected, chain } = useAccount()
  const queryClient = useQueryClient()
  const [amount, setAmount] = useState(10)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  
  const { 
    contractAddress, 
    lusdAddress, 
    lusdBalance, 
    lusdAllowance, 
    gameDetails, 
    gameId,
    userShares,
    isParticipant 
  } = useContractData()
  
  const { status, isBuying, isVoting, statusName } = useGameStatus()

  const { writeContract: approve, isPending: isApproving, data: approveHash } = useWriteContract()
  const { isLoading: isWaitingApprove, isSuccess: approveSuccess } = useWaitForTransactionReceipt({ hash: approveHash })

  const { writeContract: buyShares, isPending: isBuyingTx, data: buyHash } = useWriteContract()
  const { isLoading: isWaitingBuy, isSuccess: buySuccess } = useWaitForTransactionReceipt({ hash: buyHash })

  useEffect(() => {
    if (approveSuccess || buySuccess) {
      queryClient.invalidateQueries()
      setLastUpdate(new Date())
    }
  }, [approveSuccess, buySuccess, queryClient])

  useEffect(() => {
    const interval = setInterval(() => setLastUpdate(new Date()), 10000)
    return () => clearInterval(interval)
  }, [])

  const sharePrice = parseEther('1')
  const isWrongNetwork = chain?.id !== 421614
  const totalCost = BigInt(amount) * sharePrice
  const needsApproval = (lusdAllowance || 0n) < totalCost
  const hasBalance = (lusdBalance || 0n) >= totalCost

  const prizePool = gameDetails?.prizePool || 0n
  const tokenCap = gameDetails?.tokenCap || 0n
  const totalRevenue = gameDetails?.totalRevenue || 0n
  const progress = tokenCap > 0n ? Number((totalRevenue * 100n) / tokenCap) : 0

  const prizePoolFormatted = Number(formatEther(prizePool)).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const balanceFormatted = lusdBalance 
    ? Number(formatEther(lusdBalance)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00'

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

  const isProcessing = isApproving || isWaitingApprove || isBuyingTx || isWaitingBuy

  return (
    <NavbarLayout>
      <div className="max-w-[1200px] mx-auto">
        
        {/* PRIMARY SECTION: Pool + Action */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-px bg-white-ghost mb-px">
          
          {/* Pool Value */}
          <div className="bg-base p-6 lg:p-8">
            <div className="flex items-baseline justify-between mb-6">
              <span className="label">Prize Pool</span>
              <span className="indicator-live text-caption">
                {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div className="mb-8">
              <span className="value-display text-display-xl">{prizePoolFormatted}</span>
              <span className="text-white-tertiary text-h3 ml-3">LUSD</span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-caption mb-2">
                <span className="text-white-tertiary">Progress to cap</span>
                <span className="text-gold font-mono">{progress.toFixed(1)}%</span>
              </div>
              <div className="progress">
                <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
                {progress < 100 && <div className="progress-shimmer" />}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white-ghost">
              <div>
                <div className="label mb-1">Game</div>
                <div className="font-mono text-mono-md text-white-primary">#{gameId?.toString() || '—'}</div>
              </div>
              <div>
                <div className="label mb-1">Phase</div>
                <div className="text-body text-white-primary">{statusName}</div>
              </div>
              <div>
                <div className="label mb-1">Cap</div>
                <div className="font-mono text-mono-md text-white-primary">
                  {Number(formatEther(tokenCap)).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="bg-surface p-6">
            {!isConnected ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="text-white-tertiary text-body">Connect wallet to participate</div>
              </div>
            ) : !isBuying ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="text-gold text-h4 mb-2">Buying Closed</div>
                <div className="text-white-tertiary text-body-sm">
                  {isVoting ? 'Voting in progress' : 'Wait for next round'}
                </div>
                {isVoting && (
                  <Link href="/vote" className="btn btn-gold mt-4">Go to Vote</Link>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-baseline justify-between mb-6">
                  <span className="label">Buy Shares</span>
                  <span className="text-caption text-white-tertiary">1 share = 1 LUSD</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => setAmount(prev => Math.max(1, prev - 10))}
                    disabled={amount <= 1 || isProcessing}
                    className="btn btn-outline btn-sm w-10 h-10 p-0"
                  >−</button>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                    disabled={isProcessing}
                    className="input input-mono flex-1"
                  />
                  <button
                    onClick={() => setAmount(prev => prev + 10)}
                    disabled={isProcessing}
                    className="btn btn-outline btn-sm w-10 h-10 p-0"
                  >+</button>
                </div>

                <div className="flex gap-2 mb-6">
                  {[10, 25, 50, 100].map((qty) => (
                    <button
                      key={qty}
                      onClick={() => setAmount(qty)}
                      disabled={isProcessing}
                      className={`flex-1 py-2 text-caption font-mono transition-colors ${
                        amount === qty 
                          ? 'bg-gold text-void' 
                          : 'bg-white-ghost text-white-secondary hover:text-white-primary'
                      }`}
                    >{qty}</button>
                  ))}
                </div>

                <div className="space-y-2 mb-6 text-body-sm">
                  <div className="flex justify-between">
                    <span className="text-white-tertiary">Cost</span>
                    <span className="font-mono text-white-primary">{amount} LUSD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white-tertiary">To pool (90%)</span>
                    <span className="font-mono text-gold">{(amount * 0.9).toFixed(1)} LUSD</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white-ghost">
                    <span className="text-white-tertiary">Your balance</span>
                    <span className="font-mono text-white-secondary">{balanceFormatted}</span>
                  </div>
                </div>

                {isWrongNetwork ? (
                  <button className="btn btn-outline w-full opacity-50" disabled>
                    Switch to Arbitrum
                  </button>
                ) : !hasBalance ? (
                  <button className="btn btn-outline w-full opacity-50" disabled>
                    Insufficient Balance
                  </button>
                ) : needsApproval ? (
                  <button className="btn btn-gold w-full" onClick={handleApprove} disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Approve LUSD'}
                  </button>
                ) : (
                  <button className="btn btn-gold w-full" onClick={handleBuy} disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : `Buy ${amount} Shares`}
                  </button>
                )}
              </>
            )}
          </div>
        </section>

        {/* SECONDARY SECTION: Your Position */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white-ghost mb-px">
          <div className="bg-surface p-6">
            <div className="label mb-2">Your Shares</div>
            <div className="value-display text-display-md value-gold">{Number(formatEther(userShares)).toLocaleString()}</div>
          </div>
          <div className="bg-surface p-6">
            <div className="label mb-2">Value</div>
            <div className="value-display text-display-md">{Number(formatEther(userShares)).toLocaleString()} LUSD</div>
          </div>
          <div className="bg-surface p-6">
            <div className="label mb-2">Status</div>
            <div className="text-h3 text-white-primary">
              {isParticipant ? (
                <span className="text-gold">Participating</span>
              ) : (
                <span className="text-white-tertiary">Not joined</span>
              )}
            </div>
          </div>
        </section>

        {/* TERTIARY: Quick links */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white-ghost">
          <Link href="/winners" className="bg-surface p-5 hover:bg-elevated transition-colors group">
            <div className="label mb-1">Recent</div>
            <div className="text-h4 text-white-primary group-hover:text-gold transition-colors">Winners →</div>
          </Link>
          <Link href="/vote" className="bg-surface p-5 hover:bg-elevated transition-colors group">
            <div className="label mb-1">Active</div>
            <div className="text-h4 text-white-primary group-hover:text-gold transition-colors">Voting →</div>
          </Link>
          <Link href="/stats" className="bg-surface p-5 hover:bg-elevated transition-colors group">
            <div className="label mb-1">Your</div>
            <div className="text-h4 text-white-primary group-hover:text-gold transition-colors">Position →</div>
          </Link>
          <Link href="/how-it-works" className="bg-surface p-5 hover:bg-elevated transition-colors group">
            <div className="label mb-1">Game</div>
            <div className="text-h4 text-white-primary group-hover:text-gold transition-colors">Rules →</div>
          </Link>
        </section>

      </div>
    </NavbarLayout>
  )
}
