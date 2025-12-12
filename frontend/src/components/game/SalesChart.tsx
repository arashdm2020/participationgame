'use client'

import { useEffect, useRef, useState } from 'react'
import { BarChart3, TrendingUp } from 'lucide-react'

interface ChartData {
  labels: string[]
  data: number[]
}

const WEEKLY_DATA: ChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  data: [12, 19, 8, 15, 22, 30, 25]
}

const MONTHLY_DATA: ChartData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  data: [85, 120, 95, 150]
}

export function SalesChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<any>(null)
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly')
  const [isChartLoaded, setIsChartLoaded] = useState(false)

  useEffect(() => {
    let Chart: any

    const loadChart = async () => {
      try {
        const chartModule = await import('chart.js/auto')
        Chart = chartModule.default || chartModule.Chart
        setIsChartLoaded(true)
      } catch (error) {
        console.error('Chart.js not available:', error)
        return
      }

      if (!canvasRef.current || !Chart) return

      const ctx = canvasRef.current.getContext('2d')
      if (!ctx) return

      // Destroy existing chart
      if (chartRef.current) {
        chartRef.current.destroy()
      }

      const currentData = period === 'weekly' ? WEEKLY_DATA : MONTHLY_DATA

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 200)
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)')
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: currentData.labels,
          datasets: [{
            label: 'Shares Sold',
            data: currentData.data,
            borderColor: 'rgba(255, 255, 255, 0.9)',
            backgroundColor: gradient,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgba(255, 255, 255, 1)',
            pointBorderColor: 'rgba(255, 255, 255, 1)',
            pointRadius: 4,
            pointHoverRadius: 6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1500,
            easing: 'easeOutQuart'
          },
          interaction: {
            intersect: false,
            mode: 'index'
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(30, 30, 35, 0.95)',
              titleColor: '#ffffff',
              bodyColor: '#a0a0a0',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              padding: 12,
              cornerRadius: 8,
              displayColors: false,
              callbacks: {
                label: function(context: any) {
                  return `${context.parsed.y} shares`
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.5)',
                font: {
                  size: 11
                }
              },
              border: {
                display: false
              }
            },
            y: {
              grid: {
                color: 'rgba(255, 255, 255, 0.05)'
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.5)',
                font: {
                  size: 11
                }
              },
              border: {
                display: false
              }
            }
          }
        }
      })
    }

    loadChart()

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [period])

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-secondary/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-accent-secondary" />
          </div>
          <div>
            <h3 className="text-heading-3 text-text-primary">Sales Trend</h3>
            <p className="text-body-sm text-text-tertiary">Share purchases over time</p>
          </div>
        </div>

        {/* Period toggle */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-secondary">
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-3 py-1.5 rounded-md text-body-sm font-medium transition-all ${
              period === 'weekly'
                ? 'bg-accent-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-3 py-1.5 rounded-md text-body-sm font-medium transition-all ${
              period === 'monthly'
                ? 'bg-accent-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Chart container */}
      <div className="relative h-48">
        <canvas ref={canvasRef} />
        {!isChartLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2 text-text-tertiary">
              <TrendingUp className="w-5 h-5 animate-pulse" />
              <span className="text-body-sm">Loading chart...</span>
            </div>
          </div>
        )}
      </div>

      {/* Summary stats */}
      <div className="mt-4 pt-4 border-t border-border-primary flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-status-success" />
          <span className="text-body-sm text-status-success font-medium">+15.3%</span>
          <span className="text-body-sm text-text-tertiary">vs last {period === 'weekly' ? 'week' : 'month'}</span>
        </div>
        <div className="text-body-sm text-text-secondary">
          Total: <span className="font-semibold text-text-primary">
            {period === 'weekly' 
              ? WEEKLY_DATA.data.reduce((a, b) => a + b, 0)
              : MONTHLY_DATA.data.reduce((a, b) => a + b, 0)
            } shares
          </span>
        </div>
      </div>
    </div>
  )
}
