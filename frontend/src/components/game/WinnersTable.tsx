'use client'

import { useState, useEffect } from 'react'
import { Trophy, ExternalLink, Copy, CheckCircle } from 'lucide-react'

interface Winner {
  id: number
  gameId: number
  wallet: string
  txHash: string
  prize: string
  date: string
}

const MOCK_WINNERS: Winner[] = [
  { id: 1, gameId: 12, wallet: '0x1234...5678', txHash: '0xabcd...ef01', prize: '850.00', date: '2024-01-15' },
  { id: 2, gameId: 11, wallet: '0x8765...4321', txHash: '0x9876...5432', prize: '720.50', date: '2024-01-10' },
  { id: 3, gameId: 10, wallet: '0xfedc...ba98', txHash: '0x1111...2222', prize: '1,250.00', date: '2024-01-05' },
  { id: 4, gameId: 9, wallet: '0xaaaa...bbbb', txHash: '0x3333...4444', prize: '980.25', date: '2024-01-01' },
  { id: 5, gameId: 8, wallet: '0xcccc...dddd', txHash: '0x5555...6666', prize: '1,100.00', date: '2023-12-28' },
]

const LAST_LOTTERY = {
  hash: '0x7a8b...9c0d',
  date: '2024-01-15 14:32 UTC'
}

export function WinnersTable() {
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [visibleRows, setVisibleRows] = useState<number[]>([])

  useEffect(() => {
    MOCK_WINNERS.forEach((_, index) => {
      setTimeout(() => {
        setVisibleRows(prev => [...prev, index])
      }, index * 100)
    })
  }, [])

  const copyToClipboard = (text: string, id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-accent-primary" />
          <h3 className="text-body-md font-semibold text-text-primary">Recent Winners</h3>
        </div>
        <div className="flex items-center gap-2 text-body-xs text-text-tertiary">
          <span>Last Draw:</span>
          <a 
            href={`https://sepolia.arbiscan.io/tx/${LAST_LOTTERY.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-accent-primary hover:underline"
          >
            {LAST_LOTTERY.hash}
          </a>
          <span className="text-text-tertiary">• {LAST_LOTTERY.date}</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-primary/50">
              <th className="text-center text-body-xs text-text-tertiary font-medium py-2 px-3 w-16">Game</th>
              <th className="text-center text-body-xs text-text-tertiary font-medium py-2 px-3">Winner</th>
              <th className="text-center text-body-xs text-text-tertiary font-medium py-2 px-3">Tx Hash</th>
              <th className="text-center text-body-xs text-text-tertiary font-medium py-2 px-3 w-24">Date</th>
              <th className="text-center text-body-xs text-text-tertiary font-medium py-2 px-3 w-28">Prize</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_WINNERS.map((winner, index) => (
              <tr 
                key={winner.id}
                className={`hover:bg-surface-secondary/30 transition-all duration-300 ${
                  visibleRows.includes(index) 
                    ? 'opacity-100' 
                    : 'opacity-0'
                }`}
              >
                <td className="py-2 px-3 text-center">
                  <span className="text-body-sm font-semibold text-accent-primary">#{winner.gameId}</span>
                </td>
                <td className="py-2 px-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="font-mono text-body-sm text-text-primary">{winner.wallet}</span>
                    <button 
                      onClick={(e) => copyToClipboard(winner.wallet, winner.id, e)}
                      className="text-text-tertiary hover:text-accent-primary transition-colors"
                    >
                      {copiedId === winner.id ? (
                        <CheckCircle className="w-3.5 h-3.5 text-status-success" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="py-2 px-3 text-center">
                  <a 
                    href={`https://sepolia.arbiscan.io/tx/${winner.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 font-mono text-body-sm text-accent-primary hover:underline"
                  >
                    {winner.txHash}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
                <td className="py-2 px-3 text-center">
                  <span className="text-body-xs text-text-tertiary">{winner.date}</span>
                </td>
                <td className="py-2 px-3 text-center">
                  <span className="text-body-sm font-semibold text-status-success">{winner.prize}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
