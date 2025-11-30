'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ShoppingCart, 
  Zap, 
  Users, 
  Trophy,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { GameStatus } from '@/config/contracts'
import { useContractData, useGameStatus } from '@/lib/hooks'

export function GameProgress() {
  const t = useTranslations('game.progress')
  const { gameDetails } = useContractData()
  const { status, statusName } = useGameStatus()

  const steps = [
    {
      id: 1,
      label: t('selling'),
      sublabel: t('sellingDesc'),
      icon: ShoppingCart,
      statuses: [GameStatus.Buying],
    },
    {
      id: 2,
      label: t('elimination'),
      sublabel: t('eliminationDesc'),
      icon: Zap,
      statuses: [GameStatus.CapReached, GameStatus.VRF_Request, GameStatus.Eliminating],
    },
    {
      id: 3,
      label: t('voting8'),
      sublabel: t('voting8Desc'),
      icon: Users,
      statuses: [GameStatus.Voting8],
    },
    {
      id: 4,
      label: t('voting4'),
      sublabel: t('voting4Desc'),
      icon: Users,
      statuses: [GameStatus.Voting4],
    },
    {
      id: 5,
      label: t('winner'),
      sublabel: t('winnerDesc'),
      icon: Trophy,
      statuses: [GameStatus.Voting2, GameStatus.Finished],
    },
  ]

  const getStepStatus = (step: typeof steps[0]) => {
    const currentIndex = steps.findIndex((s) => s.statuses.includes(status))
    const stepIndex = steps.findIndex((s) => s.id === step.id)

    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'current'
    return 'pending'
  }

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-amber-500" />
            {t('title')}
          </CardTitle>
          <Button variant="secondary" size="sm" className="text-xs">
            {t(`status.${statusName}`)}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between gap-2 overflow-x-auto pb-2">
          {steps.map((step, index) => {
            const stepStatus = getStepStatus(step)
            const Icon = step.icon

            return (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step */}
                <div className="flex flex-col items-center flex-1 min-w-[80px]">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 mb-2',
                      stepStatus === 'completed' && 'bg-green-500 text-white',
                      stepStatus === 'current' && 'bg-amber-500 text-white ring-4 ring-amber-500/30',
                      stepStatus === 'pending' && 'bg-slate-700 text-slate-400'
                    )}
                  >
                    {stepStatus === 'completed' ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : stepStatus === 'current' ? (
                      <Icon className="h-5 w-5" />
                    ) : (
                      <span className="text-lg font-bold">{step.id}</span>
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium text-center',
                      stepStatus === 'completed' && 'text-green-400',
                      stepStatus === 'current' && 'text-amber-400',
                      stepStatus === 'pending' && 'text-slate-500'
                    )}
                  >
                    {step.label}
                  </span>
                  <span className="text-[10px] text-slate-500 text-center mt-0.5">
                    {step.sublabel}
                  </span>
                </div>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'h-0.5 flex-1 min-w-[20px] mx-1 rounded-full transition-all duration-300 mt-[-30px]',
                      getStepStatus(steps[index + 1]) !== 'pending'
                        ? 'bg-green-500'
                        : 'bg-slate-700'
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
