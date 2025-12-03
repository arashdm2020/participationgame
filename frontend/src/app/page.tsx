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
import { Trophy, Users, Coins, TrendingUp, Wallet, Target, ExternalLink, Sparkles, ArrowRight } from 'lucide-react'

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
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-amber-500/30">
        {/* Golden Glow Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,191,36,0.1),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/50 bg-amber-500/5">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-amber-500 text-sm font-medium tracking-wide">
                {t(`home.status.${statusName}`)}
              </span>
            </div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
                <span className="text-white">{t('home.title')}</span>
                <br />
                <span className="text-amber-500">{t('home.subtitle')}</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
                {t('home.description')}
              </p>
            </div>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto pt-8">
              <div className="p-4 md:p-6 border border-slate-800 rounded-2xl bg-slate-950/50 hover:border-amber-500/50 transition-all">
                <div className="text-xs md:text-sm text-slate-500 mb-2">{t('home.round')}</div>
                <div className="text-2xl md:text-4xl font-bold text-white">#{gameId?.toString()}</div>
              </div>
              <div className="p-4 md:p-6 border border-amber-500/30 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent">
                <div className="text-xs md:text-sm text-slate-500 mb-2">{t('home.prizePool')}</div>
                <div className="text-2xl md:text-4xl font-bold text-amber-500">{formatLUSD(prizePool)}</div>
              </div>
              <div className="p-4 md:p-6 border border-slate-800 rounded-2xl bg-slate-950/50 hover:border-amber-500/50 transition-all">
                <div className="text-xs md:text-sm text-slate-500 mb-2">{t('home.participants')}</div>
                <div className="text-2xl md:text-4xl font-bold text-white">{participantCount}</div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              {!isConnected ? (
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <Button 
                      onClick={openConnectModal}
                      size="lg" 
                      className="px-8 py-6 text-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold"
                    >
                      {t('common.connectWallet')}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  )}
                </ConnectButton.Custom>
              ) : (
                <Link href="#game">
                  <Button 
                    size="lg" 
                    className="px-8 py-6 text-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold"
                  >
                    {isBuying ? t('home.buyNow') : isVoting ? t('home.voteNow') : t('home.viewGame')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="border-b border-slate-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">{t('home.filled')}</span>
            <span className="text-sm text-amber-500 font-bold">{progress.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-slate-600">
            <span>{formatLUSD(totalRevenue)} LUSD</span>
            <span>{formatLUSD(tokenCap)} LUSD</span>
          </div>
        </div>
      </section>

      {/* User Info Bar */}
      {isConnected && (
        <section className="border-b border-slate-900 bg-slate-950/50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-slate-600" />
                  <code className="text-slate-400">{formatAddress(address || '')}</code>
                </div>
                <div className="h-4 w-px bg-slate-800" />
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-amber-500" />
                  <span className="text-white font-medium">{formatLUSD(lusdBalance || 0n)} LUSD</span>
                </div>
                {isParticipant && (
                  <>
                    <div className="h-4 w-px bg-slate-800" />
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      <span className="text-amber-500 font-medium">{userShares.toString()} {t('home.shares')}</span>
                    </div>
                  </>
                )}
              </div>
              <a
                href={`${BLOCK_EXPLORER}/address/${contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-slate-500 hover:text-amber-500 transition-colors"
              >
                {t('home.viewContract')}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section id="game" className="container mx-auto px-4 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Card className="bg-slate-950 border-slate-800 hover:border-amber-500/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-amber-500" />
                <span className="text-xs text-slate-500">{t('home.totalPrizeAllGames')}</span>
              </div>
              <div className="text-2xl font-bold text-white">{formatLUSD(totalPrizePoolAllGames || 0n)}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-950 border-amber-500/30 hover:border-amber-500/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                <span className="text-xs text-slate-500">{t('home.currentPrize')}</span>
              </div>
              <div className="text-2xl font-bold text-amber-500">{formatLUSD(prizePool)}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-950 border-slate-800 hover:border-amber-500/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-5 w-5 text-amber-500" />
                <span className="text-xs text-slate-500">
                  {isVoting ? t('home.activeParticipants') : t('home.participants')}
                </span>
              </div>
              <div className="text-2xl font-bold text-white">
                {isVoting ? activeParticipantCount : participantCount}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/30 hover:border-amber-500/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-5 w-5 text-amber-500" />
                <span className="text-xs text-slate-500">{t('home.winnerPrize')}</span>
              </div>
              <div className="text-2xl font-bold text-amber-500">85%</div>
            </CardContent>
          </Card>
        </div>

        {/* Game Area */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            {isBuying ? <BuyShares /> : isVoting ? <VotingPanel variant="full" /> : <WinnersHistory />}
            <GameProgress />
          </div>
          <div>
            <GameStats />
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <Sparkles className="h-7 w-7 text-amber-500" />
              {t('home.howItWorks')}
            </h2>
            <Link href="/how-it-works" className="text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-2">
              {t('home.learnMore')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: t('home.step1Title'), desc: t('home.step1Desc'), num: '01' },
              { title: t('home.step2Title'), desc: t('home.step2Desc'), num: '02' },
              { title: t('home.step3Title'), desc: t('home.step3Desc'), num: '03' },
              { title: t('home.step4Title'), desc: t('home.step4Desc'), num: '04' },
            ].map((step, i) => (
              <Card key={i} className="bg-slate-950 border-slate-800 hover:border-amber-500/50 transition-all group">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-amber-500/20 group-hover:text-amber-500/40 transition-colors mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Winner History */}
        <WinnersHistory />
      </section>
    </div>
  )
}
