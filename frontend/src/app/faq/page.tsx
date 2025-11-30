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
    { question: t('faq.q1'), answer: t('faq.a1') },
    { question: t('faq.q2'), answer: t('faq.a2') },
    { question: t('faq.q3'), answer: t('faq.a3') },
    { question: t('faq.q4'), answer: t('faq.a4') },
    { question: t('faq.q5'), answer: t('faq.a5') },
    { question: t('faq.q6'), answer: t('faq.a6') },
    { question: t('faq.q7'), answer: t('faq.a7') },
    { question: t('faq.q8'), answer: t('faq.a8') },
  ]

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="text-center mb-8 md:mb-12">
        <HelpCircle className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-amber-500" />
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('faq.title')}</h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
          {t('faq.subtitle')}
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
      <div className="max-w-3xl mx-auto mt-8 md:mt-12 text-center">
        <Card className="glass-card p-6 md:p-8">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-2">
            {t('faq.stillHaveQuestions')}
          </h2>
          <p className="text-slate-400 mb-4 text-sm md:text-base">
            {t('faq.joinCommunity')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <a
              href="https://github.com/arashdm2020/Participation-Game"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 rounded-lg bg-slate-700 text-white font-medium hover:bg-slate-600 transition-colors"
            >
              GitHub
            </a>
          </div>
        </Card>
      </div>
    </div>
  )
}
