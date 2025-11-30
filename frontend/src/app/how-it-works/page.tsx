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
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.description'),
      details: [
        t('howItWorks.step1.detail1'),
        t('howItWorks.step1.detail2'),
        t('howItWorks.step1.detail3'),
        t('howItWorks.step1.detail4'),
      ],
      color: 'amber',
    },
    {
      number: 2,
      icon: Shuffle,
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.description'),
      details: [
        t('howItWorks.step2.detail1'),
        t('howItWorks.step2.detail2'),
        t('howItWorks.step2.detail3'),
        t('howItWorks.step2.detail4'),
      ],
      color: 'purple',
    },
    {
      number: 3,
      icon: Users,
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.description'),
      details: [
        t('howItWorks.step3.detail1'),
        t('howItWorks.step3.detail2'),
        t('howItWorks.step3.detail3'),
        t('howItWorks.step3.detail4'),
      ],
      color: 'blue',
    },
    {
      number: 4,
      icon: Trophy,
      title: t('howItWorks.step4.title'),
      description: t('howItWorks.step4.description'),
      details: [
        t('howItWorks.step4.detail1'),
        t('howItWorks.step4.detail2'),
        t('howItWorks.step4.detail3'),
        t('howItWorks.step4.detail4'),
      ],
      color: 'green',
    },
  ]

  const features = [
    {
      icon: Shield,
      title: t('howItWorks.features.decentralized.title'),
      description: t('howItWorks.features.decentralized.description'),
    },
    {
      icon: Zap,
      title: t('howItWorks.features.vrf.title'),
      description: t('howItWorks.features.vrf.description'),
    },
    {
      icon: Clock,
      title: t('howItWorks.features.voting.title'),
      description: t('howItWorks.features.voting.description'),
    },
    {
      icon: CheckCircle,
      title: t('howItWorks.features.transparent.title'),
      description: t('howItWorks.features.transparent.description'),
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="text-center mb-8 md:mb-16">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          {t('howItWorks.title')}
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
          {t('howItWorks.subtitle')}
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-4xl mx-auto space-y-6 mb-12 md:mb-16">
        {steps.map((step, index) => (
          <Card key={index} className="glass-card overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Step Number */}
              <div className="p-6 md:p-8 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 md:w-40">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <span className="text-2xl md:text-3xl font-bold text-white">{step.number}</span>
                </div>
              </div>

              {/* Content */}
              <CardContent className="flex-1 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <step.icon className="h-5 w-5 md:h-6 md:w-6 text-amber-500" />
                  <h3 className="text-xl md:text-2xl font-bold text-white">{step.title}</h3>
                </div>
                <p className="text-slate-400 mb-4 text-sm md:text-base">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300 text-sm md:text-base">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
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
      <div className="max-w-4xl mx-auto mb-12 md:mb-16">
        <h2 className="text-xl md:text-2xl font-bold text-center text-white mb-6 md:mb-8">
          {t('howItWorks.featuresTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card p-4 md:p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 md:p-3 rounded-lg bg-amber-500/10 flex-shrink-0">
                  <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 text-sm md:text-base">{feature.title}</h3>
                  <p className="text-slate-400 text-xs md:text-sm">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Prize Distribution */}
      <div className="max-w-4xl mx-auto mb-12 md:mb-16">
        <Card className="glass-card p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-center text-white mb-6 md:mb-8">
            {t('howItWorks.prizeDistribution')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center">
            <div className="p-3 md:p-4 rounded-xl bg-slate-700/30">
              <div className="text-2xl md:text-3xl font-bold text-red-500 mb-1">10%</div>
              <p className="text-slate-400 text-xs md:text-sm">{t('howItWorks.platformFee')}</p>
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-slate-700/30">
              <div className="text-2xl md:text-3xl font-bold text-amber-500 mb-1">90%</div>
              <p className="text-slate-400 text-xs md:text-sm">{t('howItWorks.prizePool')}</p>
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-slate-700/30">
              <div className="text-2xl md:text-3xl font-bold text-green-500 mb-1">85%</div>
              <p className="text-slate-400 text-xs md:text-sm">{t('howItWorks.finalWinner')}</p>
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-slate-700/30">
              <div className="text-2xl md:text-3xl font-bold text-blue-500 mb-1">5%</div>
              <p className="text-slate-400 text-xs md:text-sm">{t('howItWorks.consolation')}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link href="/">
          <Button size="lg" className="w-full sm:w-auto">
            {t('howItWorks.startPlaying')}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
