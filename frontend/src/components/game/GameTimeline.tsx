'use client'

import { useGameStatus } from '@/lib/hooks'
import { Check } from 'lucide-react'

const STAGES = [
  { id: 0, label: 'Buy', short: 'Buy' },
  { id: 1, label: 'Cap', short: 'Cap' },
  { id: 2, label: 'VRF', short: 'VRF' },
  { id: 3, label: 'Elim', short: 'Elim' },
  { id: 4, label: 'Vote 8', short: 'V8' },
  { id: 5, label: 'Vote 4', short: 'V4' },
  { id: 6, label: 'Vote 2', short: 'V2' },
  { id: 7, label: 'End', short: 'End' },
]

export function GameTimeline() {
  const { status } = useGameStatus()

  return (
    <div className="card">
      <h3 className="text-heading-3 text-text-primary mb-6">Game Progress</h3>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-border-subtle" />
        <div 
          className="absolute top-4 left-0 h-0.5 bg-accent-primary transition-all duration-500"
          style={{ width: `${(status / 7) * 100}%` }}
        />

        {/* Stages */}
        <div className="relative flex justify-between">
          {STAGES.map((stage) => {
            const isCompleted = status > stage.id
            const isCurrent = status === stage.id
            const isPending = status < stage.id

            return (
              <div key={stage.id} className="flex flex-col items-center">
                {/* Dot */}
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-300
                    ${isCompleted 
                      ? 'bg-accent-primary text-white' 
                      : isCurrent 
                        ? 'bg-accent-primary text-white ring-4 ring-accent-primary/30' 
                        : 'bg-bg-elevated border-2 border-border-subtle text-text-tertiary'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-body-sm font-medium">{stage.id + 1}</span>
                  )}
                </div>

                {/* Label */}
                <span 
                  className={`
                    mt-2 text-body-sm font-medium
                    ${isCurrent ? 'text-accent-primary' : isCompleted ? 'text-text-primary' : 'text-text-tertiary'}
                  `}
                >
                  {stage.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
