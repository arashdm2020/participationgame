'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Coins,
  Shuffle,
  Users,
  Trophy,
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
  Zap,
} from 'lucide-react'

export default function HowItWorksPage() {
  const t = useTranslations()

  const steps = [
    {
      number: 1,
      icon: Coins,
      title: t('landing.howItWorks.step1.title'),
      description: t('landing.howItWorks.step1.description'),
      details: [
        'Purchase shares using LUSD token',
        'Each share costs 1 LUSD',
        'No limit on number of shares per user',
        'Shares are recorded on-chain',
      ],
      color: 'amber',
    },
    {
      number: 2,
      icon: Shuffle,
      title: t('landing.howItWorks.step2.title'),
      description: t('landing.howItWorks.step2.description'),
      details: [
        'Triggered when token cap is reached',
        'Chainlink VRF provides random seed',
        'Fair selection of 8 participants',
        'Completely transparent and verifiable',
      ],
      color: 'purple',
    },
    {
      number: 3,
      icon: Users,
      title: t('landing.howItWorks.step3.title'),
      description: t('landing.howItWorks.step3.description'),
      details: [
        '8 → 4 → 2 participant rounds',
        '24-hour voting period each round',
        'Vote to continue or stop the game',
        'Majority decides the outcome',
      ],
      color: 'blue',
    },
    {
      number: 4,
      icon: Trophy,
      title: t('landing.howItWorks.step4.title'),
      description: t('landing.howItWorks.step4.description'),
      details: [
        'Final winner receives 85% of prize pool',
        'Consolation prizes for runners-up (5%)',
        'Automatic prize distribution',
        'Withdraw to any address',
      ],
      color: 'green',
    },
  ]

  const features = [
    {
      icon: Shield,
      title: 'Fully Decentralized',
      description: 'No central authority controls the game. Smart contract handles everything.',
    },
    {
      icon: Zap,
      title: 'Chainlink VRF',
      description: 'Verifiable Random Function ensures provably fair random selection.',
    },
    {
      icon: Clock,
      title: '24-Hour Voting',
      description: 'Each voting round lasts 24 hours, giving everyone time to participate.',
    },
    {
      icon: CheckCircle,
      title: 'On-Chain Transparency',
      description: 'All transactions and results are recorded on the blockchain.',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {t('landing.howItWorks.title')}
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          A step-by-step guide to participating in the Participation Game
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-4xl mx-auto space-y-8 mb-16">
        {steps.map((step, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Step Number */}
              <div className={`p-8 flex items-center justify-center bg-${step.color}-500/10 md:w-48`}>
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 flex items-center justify-center shadow-lg`}>
                  <span className="text-3xl font-bold text-white">{step.number}</span>
                </div>
              </div>

              {/* Content */}
              <CardContent className="flex-1 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <step.icon className={`h-6 w-6 text-${step.color}-500`} />
                  <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                </div>
                <p className="text-slate-400 mb-4">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {/* Features Grid */}
      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-center text-white mb-8">
          Key Features
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-amber-500/10">
                  <feature.icon className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Prize Distribution */}
      <div className="max-w-4xl mx-auto mb-16">
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-center text-white mb-8">
            Prize Distribution
          </h2>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-700/30">
              <div className="text-3xl font-bold text-red-500 mb-1">10%</div>
              <p className="text-slate-400 text-sm">Platform Fee</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-700/30">
              <div className="text-3xl font-bold text-amber-500 mb-1">90%</div>
              <p className="text-slate-400 text-sm">Prize Pool</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-700/30">
              <div className="text-3xl font-bold text-green-500 mb-1">85%</div>
              <p className="text-slate-400 text-sm">Final Winner</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-700/30">
              <div className="text-3xl font-bold text-blue-500 mb-1">5%</div>
              <p className="text-slate-400 text-sm">Consolation</p>
            </div>
          </div>
        </Card>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link href="/dashboard">
          <Button size="xl">
            Start Playing Now
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
