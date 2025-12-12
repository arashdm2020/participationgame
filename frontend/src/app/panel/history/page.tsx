'use client'

import { PanelLayout } from '@/components/layout/PanelLayout'
import { useAccount } from 'wagmi'
import { Wallet, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function PurchaseHistoryPage() {
  const { isConnected } = useAccount()

  // Note: In production, this would fetch from on-chain events or indexed database
  // For now, showing placeholder structure
  const purchases: Array<{
    id: string
    date: string
    amount: string
    shares: number
    gameId: number
    txHash: string
  }> = []

  if (!isConnected) {
    return (
      <PanelLayout type="user">
        <div className="max-w-lg mx-auto">
          <div className="card text-center py-12">
            <Wallet className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
            <h2 className="text-heading-2 text-text-primary mb-2">Connect Wallet</h2>
            <p className="text-body-md text-text-secondary">
              Please connect your wallet to view purchase history.
            </p>
          </div>
        </div>
      </PanelLayout>
    )
  }

  return (
    <PanelLayout type="user">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-heading-1 text-text-primary mb-2">Purchase History</h1>
        <p className="text-body-md text-text-secondary">
          All your share purchases across all games
        </p>
      </div>

      {/* Purchase Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left py-3 px-4 text-body-sm text-text-secondary font-medium">Date</th>
                <th className="text-left py-3 px-4 text-body-sm text-text-secondary font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-body-sm text-text-secondary font-medium">Shares</th>
                <th className="text-left py-3 px-4 text-body-sm text-text-secondary font-medium">Game</th>
                <th className="text-right py-3 px-4 text-body-sm text-text-secondary font-medium">Tx</th>
              </tr>
            </thead>
            <tbody>
              {purchases.length > 0 ? (
                purchases.map((purchase) => (
                  <tr key={purchase.id} className="border-b border-border-subtle last:border-0">
                    <td className="py-3 px-4 text-body-md text-text-primary">{purchase.date}</td>
                    <td className="py-3 px-4 font-mono text-text-primary">{purchase.amount} LUSD</td>
                    <td className="py-3 px-4 font-mono text-text-primary">{purchase.shares}</td>
                    <td className="py-3 px-4 font-mono text-text-primary">#{purchase.gameId}</td>
                    <td className="py-3 px-4 text-right">
                      <a
                        href={`https://sepolia.arbiscan.io/tx/${purchase.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-accent-primary hover:underline"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-text-tertiary">
                    <p className="mb-2">No purchases yet</p>
                    <Link href="/buy" className="text-accent-primary hover:underline">
                      Buy your first shares →
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {purchases.length > 10 && (
          <div className="border-t border-border-subtle p-4 text-center">
            <button className="btn-secondary">Load More</button>
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="mt-6 p-4 rounded-lg bg-bg-hover text-body-sm text-text-secondary">
        Purchase history is fetched from blockchain events. 
        New purchases may take a few moments to appear.
      </div>
    </PanelLayout>
  )
}
