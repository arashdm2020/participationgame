'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQItem {
  question: string
  answer: string
}

export default function FAQPage() {
  const t = useTranslations()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs: FAQItem[] = [
    {
      question: 'What is Participation Game?',
      answer: 'Participation Game is a decentralized lottery platform built on Arbitrum. It uses smart contracts and Chainlink VRF to ensure fair and transparent random selection of winners.',
    },
    {
      question: 'How do I participate?',
      answer: 'Connect your wallet, ensure you have LUSD (DAI) tokens, and purchase shares in the current game. Each share costs 1 DAI. The more shares you buy, the higher your chances of being selected.',
    },
    {
      question: 'What is LUSD?',
      answer: 'LUSD is a decentralized stablecoin pegged to USD. In our game, we use DAI as the primary token for purchasing shares and receiving prizes.',
    },
    {
      question: 'How are winners selected?',
      answer: 'When the token cap is reached, Chainlink VRF (Verifiable Random Function) is used to randomly select 8 participants. These 8 then go through voting rounds (8→4→2) until a final winner is determined.',
    },
    {
      question: 'What are the voting rounds?',
      answer: 'After elimination, the remaining 8 participants vote on whether to continue or stop the game. Each round lasts 24 hours. If majority votes to continue, half are eliminated randomly. This continues until 2 remain or majority votes to stop.',
    },
    {
      question: 'How is the prize distributed?',
      answer: '90% of total revenue goes to the prize pool. Of this, 85% goes to the final winner and 5% is distributed as consolation prizes to runners-up. 10% is the platform fee.',
    },
    {
      question: 'Is it safe?',
      answer: 'Yes! The smart contract is built with security best practices including OpenZeppelin contracts, reentrancy guards, and pausable functionality. All transactions are on-chain and verifiable.',
    },
    {
      question: 'What network does it run on?',
      answer: 'Participation Game runs on Arbitrum, an Ethereum Layer 2 solution. This provides fast transactions and low gas fees while maintaining Ethereum security.',
    },
    {
      question: 'Can I withdraw my shares?',
      answer: 'Once shares are purchased, they cannot be withdrawn. However, if you win, you can specify any address to receive your prize.',
    },
    {
      question: 'How long does a game last?',
      answer: 'Game duration depends on how quickly the token cap is reached. The target is 7 days. If it takes longer, the cap is reduced for the next game. If faster, the cap is increased.',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <HelpCircle className="h-16 w-16 mx-auto mb-4 text-amber-500" />
        <h1 className="text-4xl font-bold text-white mb-4">{t('nav.faq')}</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Find answers to commonly asked questions about Participation Game
        </p>
      </div>

      {/* FAQ List */}
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <Card
            key={index}
            className={cn(
              'cursor-pointer transition-all duration-200',
              openIndex === index && 'ring-1 ring-amber-500/50'
            )}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-6">
                <h3 className="font-semibold text-white pr-4">{faq.question}</h3>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 text-slate-400 transition-transform duration-200 flex-shrink-0',
                    openIndex === index && 'rotate-180 text-amber-500'
                  )}
                />
              </div>
              {openIndex === index && (
                <div className="px-6 pb-6 pt-0">
                  <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact */}
      <div className="max-w-3xl mx-auto mt-12 text-center">
        <Card className="p-8">
          <h2 className="text-xl font-semibold text-white mb-2">
            Still have questions?
          </h2>
          <p className="text-slate-400 mb-4">
            Join our community on Discord or Telegram for more help
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#"
              className="px-6 py-2 rounded-lg bg-[#5865F2] text-white font-medium hover:bg-[#4752C4] transition-colors"
            >
              Discord
            </a>
            <a
              href="#"
              className="px-6 py-2 rounded-lg bg-[#0088cc] text-white font-medium hover:bg-[#0077b5] transition-colors"
            >
              Telegram
            </a>
          </div>
        </Card>
      </div>
    </div>
  )
}
