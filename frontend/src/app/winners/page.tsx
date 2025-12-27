'use client'

import { useState } from 'react'
import { NavbarLayout } from '@/components/layout/NavbarLayout'
import { formatEther } from 'viem'

interface Winner {
  gameId: number
  address: string
  prizeAmount: string
  date: string
  txHash: string
}

const MOCK_WINNERS: Winner[] = [
  { gameId: 12, address: '0x1234567890123456789012345678901234567890', prizeAmount: '850000000000000000000', date: '2024-01-15', txHash: '0xabcd1234567890abcd1234567890abcd1234567890abcd1234567890abcd1234' },
  { gameId: 11, address: '0x8765432109876543210987654321098765432109', prizeAmount: '720500000000000000000', date: '2024-01-10', txHash: '0x9876543210987654321098765432109876543210987654321098765432109876' },
  { gameId: 10, address: '0xfedcba0987654321fedcba0987654321fedcba09', prizeAmount: '1250000000000000000000', date: '2024-01-05', txHash: '0x1111222233334444555566667777888899990000aaaabbbbccccddddeeee1111' },
  { gameId: 9, address: '0xaaaa1111bbbb2222cccc3333dddd4444eeee5555', prizeAmount: '980250000000000000000', date: '2024-01-01', txHash: '0x3333444455556666777788889999aaaa11112222333344445555666677778888' },
  { gameId: 8, address: '0xcccc6666dddd7777eeee8888ffff9999aaaa0000', prizeAmount: '1100000000000000000000', date: '2023-12-28', txHash: '0x5555666677778888999900001111222233334444555566667777888899990000' },
]

export default function WinnersPage() {
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedHash(text)
    setTimeout(() => setCopiedHash(null), 2000)
  }

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`
  const formatHash = (hash: string) => `${hash.slice(0, 10)}...${hash.slice(-6)}`

  return (
    <NavbarLayout>
      <div className="max-w-[900px] mx-auto">
        
        {/* Header */}
        <header className="mb-8 pt-8">
          <h1 className="text-h1 text-white-primary mb-2">Winners</h1>
          <p className="text-body text-white-secondary">
            Previous game results and prize distributions
          </p>
        </header>

        {/* Stats Summary */}
        <section className="grid grid-cols-3 gap-px bg-white-ghost mb-8">
          <div className="bg-surface p-5">
            <div className="label mb-2">Total Games</div>
            <div className="value-display text-display-md">{MOCK_WINNERS.length}</div>
          </div>
          <div className="bg-surface p-5">
            <div className="label mb-2">Total Distributed</div>
            <div className="value-display text-display-md value-gold">
              {MOCK_WINNERS.reduce((acc, w) => acc + Number(formatEther(BigInt(w.prizeAmount))), 0).toLocaleString()}
            </div>
            <div className="text-caption text-white-tertiary">LUSD</div>
          </div>
          <div className="bg-surface p-5">
            <div className="label mb-2">Avg Prize</div>
            <div className="value-display text-display-md">
              {(MOCK_WINNERS.reduce((acc, w) => acc + Number(formatEther(BigInt(w.prizeAmount))), 0) / MOCK_WINNERS.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-caption text-white-tertiary">LUSD</div>
          </div>
        </section>

        {/* Winners Table */}
        <section>
          <div className="panel">
            <table className="table">
              <thead>
                <tr>
                  <th>Game</th>
                  <th>Winner</th>
                  <th>Prize</th>
                  <th>Date</th>
                  <th className="text-right">Transaction</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_WINNERS.map((winner, index) => (
                  <tr 
                    key={winner.gameId}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td>
                      <span className="text-gold font-mono">#{winner.gameId}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => copyToClipboard(winner.address)}
                        className="font-mono text-mono-sm text-white-secondary hover:text-white-primary transition-colors"
                        title="Click to copy"
                      >
                        {formatAddress(winner.address)}
                        {copiedHash === winner.address && (
                          <span className="ml-2 text-gold text-caption">Copied</span>
                        )}
                      </button>
                    </td>
                    <td>
                      <span className="font-mono text-mono-md text-white-primary">
                        {Number(formatEther(BigInt(winner.prizeAmount))).toLocaleString()}
                      </span>
                      <span className="text-white-tertiary text-caption ml-1">LUSD</span>
                    </td>
                    <td>
                      <span className="text-white-tertiary">{winner.date}</span>
                    </td>
                    <td className="text-right">
                      <a
                        href={`https://sepolia.arbiscan.io/tx/${winner.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-mono-sm text-gold hover:text-gold-bright transition-colors"
                      >
                        {formatHash(winner.txHash)} ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Verification Note */}
        <section className="mt-6">
          <div className="text-center text-caption text-white-tertiary">
            All results verifiable on-chain via Arbitrum Sepolia explorer
          </div>
        </section>

      </div>
    </NavbarLayout>
  )
}
