'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { PARTICIPATION_GAME_ABI, GameStatus, GAME_STATUS_NAMES } from '@/config/contracts'
import { networks } from '@/config/networks'
import { formatLUSD, formatAddress } from '@/lib/utils'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import {
  Shield,
  Settings,
  Users,
  TrendingUp,
  Coins,
  Play,
  Pause,
  Zap,
  Vote,
  Gift,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Network,
} from 'lucide-react'

export default function AdminPage() {
  const t = useTranslations('admin')
  const { address, isConnected } = useAccount()
  const [selectedNetwork, setSelectedNetwork] = useState<'testnet' | 'mainnet'>('testnet')

  const network = networks[selectedNetwork]
  const contractAddress = network.contractAddress

  // Read contract state
  const { data: currentGameId, refetch: refetchGameId } = useReadContract({
    address: contractAddress,
    abi: PARTICIPATION_GAME_ABI,
    functionName: 'currentGameId',
  })

  const { data: gameDetails, refetch: refetchGame } = useReadContract({
    address: contractAddress,
    abi: PARTICIPATION_GAME_ABI,
    functionName: 'getGameDetails',
    args: currentGameId ? [currentGameId] : undefined,
  })

  const { data: isPaused } = useReadContract({
    address: contractAddress,
    abi: PARTICIPATION_GAME_ABI,
    functionName: 'paused',
  })

  const { data: isOperator } = useReadContract({
    address: contractAddress,
    abi: PARTICIPATION_GAME_ABI,
    functionName: 'isOperator',
    args: address ? [address] : undefined,
  })

  const { data: owner } = useReadContract({
    address: contractAddress,
    abi: PARTICIPATION_GAME_ABI,
    functionName: 'owner',
  })

  const { data: totalPrizePool } = useReadContract({
    address: contractAddress,
    abi: PARTICIPATION_GAME_ABI,
    functionName: 'totalPrizePoolAllGames',
  })

  const { data: participantCount } = useReadContract({
    address: contractAddress,
    abi: PARTICIPATION_GAME_ABI,
    functionName: 'getParticipantCount',
    args: currentGameId ? [currentGameId] : undefined,
  })

  // Write functions
  const { writeContract: requestVRF, isPending: isRequestingVRF } = useWriteContract()
  const { writeContract: processVoting, isPending: isProcessingVoting } = useWriteContract()
  const { writeContract: distributeFinalPrize, isPending: isDistributing } = useWriteContract()
  const { writeContract: pauseGame, isPending: isPausing } = useWriteContract()
  const { writeContract: unpauseGame, isPending: isUnpausing } = useWriteContract()

  const isOwner = address?.toLowerCase() === owner?.toLowerCase()
  const hasAccess = isOwner || isOperator

  const gameData = gameDetails ? {
    tokenCap: gameDetails.tokenCap,
    totalRevenue: gameDetails.totalRevenue,
    prizePool: gameDetails.prizePool,
    status: gameDetails.status as GameStatus,
  } : null

  const handleRequestVRF = () => {
    if (!currentGameId) return
    requestVRF({
      address: contractAddress,
      abi: PARTICIPATION_GAME_ABI,
      functionName: 'requestRandomWords',
      args: [currentGameId],
    })
  }

  const handleProcessVoting = () => {
    if (!currentGameId) return
    processVoting({
      address: contractAddress,
      abi: PARTICIPATION_GAME_ABI,
      functionName: 'processVotingResults',
      args: [currentGameId],
    })
  }

  const handleDistributePrize = () => {
    if (!currentGameId) return
    distributeFinalPrize({
      address: contractAddress,
      abi: PARTICIPATION_GAME_ABI,
      functionName: 'distributeFinalPrize',
      args: [currentGameId],
    })
  }

  const handlePause = () => {
    pauseGame({
      address: contractAddress,
      abi: PARTICIPATION_GAME_ABI,
      functionName: 'pauseGame',
    })
  }

  const handleUnpause = () => {
    unpauseGame({
      address: contractAddress,
      abi: PARTICIPATION_GAME_ABI,
      functionName: 'unpauseGame',
    })
  }

  const refreshAll = () => {
    refetchGameId()
    refetchGame()
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Card className="max-w-md mx-auto text-center p-8">
          <Shield className="h-16 w-16 mx-auto mb-6 text-amber-500" />
          <h2 className="text-2xl font-bold text-white mb-4">Admin Access Required</h2>
          <p className="text-slate-400 mb-6">Connect your wallet to access the admin panel</p>
          <ConnectButton />
        </Card>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Card className="max-w-md mx-auto text-center p-8">
          <AlertTriangle className="h-16 w-16 mx-auto mb-6 text-red-500" />
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-slate-400 mb-4">
            You don't have permission to access the admin panel.
          </p>
          <p className="text-sm text-slate-500">
            Connected: {formatAddress(address || '')}
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-400">
              {isOwner ? '👑 Owner' : '🔧 Operator'}
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">{formatAddress(address || '')}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={refreshAll}>
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Network Selector */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Network className="h-5 w-5 text-amber-500" />
            {t('network.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              variant={selectedNetwork === 'testnet' ? 'default' : 'secondary'}
              onClick={() => setSelectedNetwork('testnet')}
            >
              Arbitrum Sepolia (Testnet)
            </Button>
            <Button
              variant={selectedNetwork === 'mainnet' ? 'default' : 'secondary'}
              onClick={() => setSelectedNetwork('mainnet')}
            >
              Arbitrum One (Mainnet)
            </Button>
          </div>
          {selectedNetwork === 'mainnet' && (
            <p className="mt-3 text-sm text-yellow-500 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {t('network.warning')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <TrendingUp className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Current Game</p>
              <p className="text-xl font-bold text-white">#{currentGameId?.toString() || '...'}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Coins className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Prize Pool</p>
              <p className="text-xl font-bold text-white">
                {totalPrizePool ? formatLUSD(totalPrizePool) : '0'} DAI
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Participants</p>
              <p className="text-xl font-bold text-white">{participantCount?.toString() || '0'}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isPaused ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
              {isPaused ? (
                <Pause className="h-5 w-5 text-red-500" />
              ) : (
                <Play className="h-5 w-5 text-green-500" />
              )}
            </div>
            <div>
              <p className="text-sm text-slate-400">Status</p>
              <p className={`text-xl font-bold ${isPaused ? 'text-red-500' : 'text-green-500'}`}>
                {isPaused ? 'Paused' : 'Active'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Game Status & Actions */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Current Game Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-500" />
              Game Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
              <span className="text-slate-400">Status</span>
              <span className="font-semibold text-white">
                {gameData ? GAME_STATUS_NAMES[gameData.status] : '...'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
              <span className="text-slate-400">Revenue</span>
              <span className="font-semibold text-white">
                {gameData ? formatLUSD(gameData.totalRevenue) : '0'} DAI
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
              <span className="text-slate-400">Token Cap</span>
              <span className="font-semibold text-white">
                {gameData ? formatLUSD(gameData.tokenCap) : '0'} DAI
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
              <span className="text-slate-400">Prize Pool</span>
              <span className="font-semibold text-green-400">
                {gameData ? formatLUSD(gameData.prizePool) : '0'} DAI
              </span>
            </div>
            {gameData && (
              <div className="pt-2">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-slate-400">
                    {((Number(gameData.totalRevenue) / Number(gameData.tokenCap)) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={(Number(gameData.totalRevenue) / Number(gameData.tokenCap)) * 100}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contract Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-amber-500" />
              {t('contractControl')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Request VRF */}
            <Button
              className="w-full justify-start"
              variant="secondary"
              onClick={handleRequestVRF}
              disabled={isRequestingVRF || gameData?.status !== GameStatus.CapReached}
            >
              {isRequestingVRF ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              {t('actions.requestVRF')}
              {gameData?.status !== GameStatus.CapReached && (
                <span className="ml-auto text-xs text-slate-500">Requires CapReached</span>
              )}
            </Button>

            {/* Process Voting */}
            <Button
              className="w-full justify-start"
              variant="secondary"
              onClick={handleProcessVoting}
              disabled={
                isProcessingVoting ||
                (gameData?.status !== GameStatus.Voting8 &&
                  gameData?.status !== GameStatus.Voting4 &&
                  gameData?.status !== GameStatus.Voting2)
              }
            >
              {isProcessingVoting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Vote className="h-4 w-4 mr-2" />
              )}
              {t('actions.processVoting')}
            </Button>

            {/* Distribute Prize */}
            <Button
              className="w-full justify-start"
              variant="secondary"
              onClick={handleDistributePrize}
              disabled={isDistributing || gameData?.status !== GameStatus.Finished}
            >
              {isDistributing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Gift className="h-4 w-4 mr-2" />
              )}
              {t('actions.distributePrizes')}
            </Button>

            <hr className="border-slate-700" />

            {/* Pause/Unpause (Owner only) */}
            {isOwner && (
              <>
                {isPaused ? (
                  <Button
                    className="w-full justify-start"
                    variant="success"
                    onClick={handleUnpause}
                    disabled={isUnpausing}
                  >
                    {isUnpausing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    {t('actions.unpause')}
                  </Button>
                ) : (
                  <Button
                    className="w-full justify-start"
                    variant="destructive"
                    onClick={handlePause}
                    disabled={isPausing}
                  >
                    {isPausing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Pause className="h-4 w-4 mr-2" />
                    )}
                    {t('actions.pause')}
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
