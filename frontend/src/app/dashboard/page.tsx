'use client'

import { useTranslations } from 'next-intl'
import { useAccount, useReadContract } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GameStats } from '@/components/game/GameStats'
import { BuyShares } from '@/components/game/BuyShares'
import { VotingPanel } from '@/components/game/VotingPanel'
import { GameProgress } from '@/components/game/GameProgress'
import { WinnersHistory } from '@/components/game/WinnersHistory'
import { PARTICIPATION_GAME_ABI, GameStatus, GAME_STATUS_NAMES } from '@/config/contracts'
import { networks } from '@/config/networks'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Wallet, TrendingUp, Vote, History } from 'lucide-react'
import { parseEther } from 'viem'

export default function DashboardPage() {
  const t = useTranslations()
  const { address, isConnected } = useAccount()
  
  // Use testnet config for now
  const network = networks.testnet
  const contractAddress = network.contractAddress

  // Read current game ID
  const { data: currentGameId } = useReadContract({
    address: contractAddress,
    abi: PARTICIPATION_GAME_ABI,
    functionName: 'currentGameId',
  })

  // Read game details
  const { data: gameDetails } = useReadContract({
    address: contractAddress,
    abi: PARTICIPATION_GAME_ABI,
    functionName: 'getGameDetails',
    args: currentGameId ? [currentGameId] : undefined,
  })

  // Read participant count
  const { data: participantCount } = useReadContract({
    address: contractAddress,
    abi: PARTICIPATION_GAME_ABI,
    functionName: 'getParticipantCount',
    args: currentGameId ? [currentGameId] : undefined,
  })

  // Read active participants
  const { data: activeParticipants } = useReadContract({
    address: contractAddress,
    abi: PARTICIPATION_GAME_ABI,
    functionName: 'getActiveParticipants',
    args: currentGameId ? [currentGameId] : undefined,
  })

  // Read vote tallies
  const { data: voteTallies } = useReadContract({
    address: contractAddress,
    abi: PARTICIPATION_GAME_ABI,
    functionName: 'getVoteTallies',
    args: currentGameId ? [currentGameId] : undefined,
  })

  // Read user participation
  const { data: userParticipation } = useReadContract({
    address: contractAddress,
    abi: PARTICIPATION_GAME_ABI,
    functionName: 'getParticipant',
    args: currentGameId && address ? [currentGameId, address] : undefined,
  })

  // Parse game details
  const gameData = gameDetails ? {
    tokenCap: gameDetails.tokenCap,
    totalRevenue: gameDetails.totalRevenue,
    prizePool: gameDetails.prizePool,
    status: gameDetails.status as GameStatus,
    votingDeadline: Number(gameDetails.votingDeadline),
  } : null

  const isVotingPhase = gameData && (
    gameData.status === GameStatus.Voting8 ||
    gameData.status === GameStatus.Voting4 ||
    gameData.status === GameStatus.Voting2
  )

  const getVotingStage = (): 8 | 4 | 2 => {
    if (gameData?.status === GameStatus.Voting8) return 8
    if (gameData?.status === GameStatus.Voting4) return 4
    return 2
  }

  const isUserParticipant = activeParticipants?.includes(address as `0x${string}`) ?? false
  const hasUserVoted = userParticipation?.hasVotedInCurrentStage ?? false

  // Mock winners data for now
  const mockWinners = [
    {
      gameId: 45,
      address: '0x7899...79c8',
      prizeAmount: '2125000000000000000000',
      date: '1403/07/25',
    },
  ]

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Card className="max-w-md mx-auto text-center p-8">
          <Wallet className="h-16 w-16 mx-auto mb-6 text-amber-500" />
          <h2 className="text-2xl font-bold text-white mb-4">
            {t('errors.walletNotConnected')}
          </h2>
          <p className="text-slate-400 mb-6">
            Connect your wallet to access the dashboard
          </p>
          <ConnectButton />
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {t('dashboard.title')}
        </h1>
        <p className="text-slate-400">
          Game #{currentGameId?.toString() || '...'} • {gameData ? GAME_STATUS_NAMES[gameData.status] : '...'}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Game Stats */}
        <GameStats
          tokenCap={gameData?.tokenCap ?? BigInt(0)}
          totalRevenue={gameData?.totalRevenue ?? BigInt(0)}
          prizePool={gameData?.prizePool ?? BigInt(0)}
          participantCount={Number(participantCount ?? 0)}
          activeParticipants={activeParticipants?.length ?? 0}
          status={gameData ? GAME_STATUS_NAMES[gameData.status] : 'Buying'}
        />

        {/* Buy Shares or Voting Panel */}
        {isVotingPhase ? (
          <VotingPanel
            contractAddress={contractAddress}
            gameId={Number(currentGameId ?? 1)}
            stage={getVotingStage()}
            continueVotes={Number(voteTallies?.[0] ?? 0)}
            stopVotes={Number(voteTallies?.[1] ?? 0)}
            votingDeadline={gameData?.votingDeadline ?? 0}
            hasVoted={hasUserVoted}
            isParticipant={isUserParticipant}
          />
        ) : (
          <BuyShares
            contractAddress={contractAddress}
            lusdAddress={network.lusdAddress}
            sharePrice={parseEther('1')}
            maxShares={1000}
          />
        )}
      </div>

      {/* Game Progress */}
      <div className="mb-8">
        <GameProgress status={gameData?.status ?? GameStatus.Buying} />
      </div>

      {/* Winners History */}
      <WinnersHistory
        winners={mockWinners}
        blockExplorer={network.blockExplorer}
      />
    </div>
  )
}
