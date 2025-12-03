'use client'

import { useTranslations } from 'next-intl'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GameStats } from '@/components/game/GameStats'
import { BuyShares } from '@/components/game/BuyShares'
import { VotingPanel } from '@/components/game/VotingPanel'
import { GameProgress } from '@/components/game/GameProgress'
import { WinnersHistory } from '@/components/game/WinnersHistory'
import { useContractData, useGameStatus } from '@/lib/hooks'
import { formatLUSD, formatAddress } from '@/lib/utils'
import { BLOCK_EXPLORER } from '@/config/wagmi'
import Link from 'next/link'
import {
  Trophy,
  Users,
  Coins,
  TrendingUp,
  Wallet,
  Clock,
  Target,
  Zap,
  ExternalLink,
  Hash,
  Crown,
  Sparkles,
  ChevronRight,
  Activity
} from 'lucide-react'

export default function Home() {
  const t = useTranslations()
  const { isConnected, address } = useAccount()
  const {
    gameId,
    gameDetails,
    participantCount,
    activeParticipantCount,
    userShares,
    isParticipant,
    lusdBalance,
    totalPrizePoolAllGames,
    contractAddress,
    isLoading
  } = useContractData()
  const { statusName, isBuying, isVoting, isFinished, votingStage } = useGameStatus()

  const prizePool = gameDetails?.prizePool || 0n
  const tokenCap = gameDetails?.tokenCap || 0n
  const totalRevenue = gameDetails?.totalRevenue || 0n
  const progress = tokenCap > 0n ? Number((totalRevenue * 100n) / tokenCap) : 0

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-amber-500/20">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-8 md:py-12 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left: Game Info */}
            <div className="flex-1 text-center lg:text-start">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
                <Activity className="h-4 w-4 text-amber-500 animate-pulse" />
                <span className="text-amber-400 text-sm font-medium">{t('home.liveGame')}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                {t('home.title')}
                <span className="block text-amber-500">{t('home.subtitle')}</span>
              </h1>
              
              <p className="text-slate-400 text-base md:text-lg max-w-xl mb-6">
                {t('home.description')}
              </p>

              {/* Quick Stats Row */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Hash className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{t('home.round')}</p>
                    <p className="text-lg font-bold text-white">{gameId?.toString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Trophy className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{t('home.prizePool')}</p>
                    <p className="text-lg font-bold text-green-400">{formatLUSD(prizePool)} LUSD</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{t('home.participants')}</p>
                    <p className="text-lg font-bold text-white">{participantCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Current Status Card */}
            <div className="w-full lg:w-auto">
              <Card className="glass-card border-amber-500/30 w-full lg:w-80">
                <CardContent className="p-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-400 text-sm">{t('home.gameStatus')}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isBuying ? 'bg-green-500/20 text-green-400' :
                      isVoting ? 'bg-amber-500/20 text-amber-400' :
                      isFinished ? 'bg-purple-500/20 text-purple-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {t(`home.status.${statusName}`)}
                    </span>
                  </div>

                  {/* Progress Circle */}
                  <div className="flex justify-center mb-4">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                        <circle
                          cx="64" cy="64" r="56"
                          stroke="currentColor" strokeWidth="8" fill="none"
                          className="text-slate-700"
                        />
                        <circle
                          cx="64" cy="64" r="56"
                          stroke="url(#heroGradient)" strokeWidth="8" fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${progress * 3.52} 352`}
                          className="transition-all duration-1000"
                        />
                        <defs>
                          <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#f97316" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-white">{progress.toFixed(0)}%</span>
                        <span className="text-xs text-slate-400">{t('home.filled')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Info */}
                  <div className="p-3 rounded-xl bg-slate-800/50 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">{t('home.collected')}</span>
                      <span className="text-white font-bold">{formatLUSD(totalRevenue)} / {formatLUSD(tokenCap)} LUSD</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  {!isConnected ? (
                    <div className="flex justify-center">
                      <ConnectButton />
                    </div>
                  ) : (
                    <Link href="#action">
                      <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600" size="lg">
                        {isBuying ? t('home.buyNow') : isVoting ? t('home.voteNow') : t('home.viewGame')}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* User Status Bar (if connected) */}
      {isConnected && (
        <section className="border-b border-slate-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-400 text-sm">{formatAddress(address || '')}</span>
                </div>
                <div className="h-4 w-px bg-slate-700" />
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-amber-500" />
                  <span className="text-white font-medium">{formatLUSD(lusdBalance || 0n)} LUSD</span>
                </div>
                {isParticipant && (
                  <>
                    <div className="h-4 w-px bg-slate-700" />
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-green-500" />
                      <span className="text-green-400 font-medium">{userShares.toString()} {t('home.shares')}</span>
                    </div>
                  </>
                )}
              </div>
              <a
                href={`${BLOCK_EXPLORER}/address/${contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-slate-500 hover:text-amber-500 text-sm transition-colors"
              >
                {t('home.viewContract')}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card p-4 border-l-4 border-l-amber-500">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <TrendingUp className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{t('home.totalPrizeAllGames')}</p>
                <p className="text-lg font-bold text-white">{formatLUSD(totalPrizePoolAllGames || 0n)}</p>
              </div>
            </div>
          </Card>
          <Card className="glass-card p-4 border-l-4 border-l-green-500">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Trophy className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{t('home.currentPrize')}</p>
                <p className="text-lg font-bold text-green-400">{formatLUSD(prizePool)}</p>
              </div>
            </div>
          </Card>
          <Card className="glass-card p-4 border-l-4 border-l-blue-500">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{isVoting ? t('home.activeParticipants') : t('home.participants')}</p>
                <p className="text-lg font-bold text-white">{isVoting ? activeParticipantCount : participantCount}</p>
              </div>
            </div>
          </Card>
          <Card className="glass-card p-4 border-l-4 border-l-purple-500">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Target className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{t('home.winnerPrize')}</p>
                <p className="text-lg font-bold text-purple-400">85%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Grid: Action + Stats */}
        <div id="action" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left: Buy/Vote Panel (Main Action) */}
          <div className="lg:col-span-2">
            {isBuying ? (
              <BuyShares />
            ) : isVoting ? (
              <VotingPanel variant="full" />
            ) : (
              <WinnersHistory />
            )}
          </div>

          {/* Right: Game Stats */}
          <div className="space-y-6">
            <GameStats />
            
            {/* Voting Stage Info (if voting) */}
            {isVoting && (
              <Card className="glass-card border-amber-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="h-5 w-5 text-amber-500" />
                    {t('home.votingRound')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center gap-4">
                    {[8, 4, 2].map((stage) => (
                      <div
                        key={stage}
                        className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                          votingStage === stage
                            ? 'bg-amber-500/20 border border-amber-500/50 scale-110'
                            : votingStage > stage
                            ? 'bg-slate-700/30 opacity-50'
                            : 'bg-slate-800/50'
                        }`}
                      >
                        <span className={`text-2xl font-bold ${votingStage === stage ? 'text-amber-400' : 'text-slate-400'}`}>
                          {stage}
                        </span>
                        <span className="text-xs text-slate-500">{t('home.players')}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Game Progress */}
        <div className="mb-8">
          <GameProgress />
        </div>

        {/* How It Works Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-amber-500" />
              {t('home.howItWorks')}
            </h2>
            <Link href="/how-it-works" className="text-amber-500 hover:text-amber-400 text-sm flex items-center gap-1">
              {t('home.learnMore')}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: Coins, title: t('home.step1Title'), desc: t('home.step1Desc'), color: 'amber' },
              { icon: Zap, title: t('home.step2Title'), desc: t('home.step2Desc'), color: 'purple' },
              { icon: Users, title: t('home.step3Title'), desc: t('home.step3Desc'), color: 'blue' },
              { icon: Trophy, title: t('home.step4Title'), desc: t('home.step4Desc'), color: 'green' },
            ].map((step, i) => (
              <Card key={i} className="glass-card p-4 hover:border-amber-500/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-${step.color}-500/10 flex-shrink-0`}>
                    <step.icon className={`h-5 w-5 text-${step.color}-500`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                    <p className="text-xs text-slate-400">{step.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Winner History (if not in finished state) */}
        {!isFinished && (
          <WinnersHistory />
        )}
      </section>
    </div>
  )
}
