import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function formatNumber(num: number | string, decimals = 2): string {
  const n = typeof num === 'string' ? parseFloat(num) : num
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n)
}

export function formatLUSD(amount: bigint | string, decimals = 18): string {
  const value = typeof amount === 'string' ? BigInt(amount) : amount
  const divisor = BigInt(10 ** decimals)
  const integerPart = value / divisor
  const fractionalPart = value % divisor
  
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0').slice(0, 2)
  return `${integerPart.toLocaleString()}.${fractionalStr}`
}

export function parseLUSD(amount: string, decimals = 18): bigint {
  const [integer, fraction = ''] = amount.split('.')
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals)
  return BigInt(integer + paddedFraction)
}

export function getGameStatusLabel(status: string, locale: 'en' | 'fa' = 'en'): string {
  const labels: Record<string, { en: string; fa: string }> = {
    Buying: { en: 'Buying', fa: 'در حال فروش' },
    CapReached: { en: 'Cap Reached', fa: 'سقف رسیده' },
    VRF_Request: { en: 'VRF Request', fa: 'درخواست VRF' },
    Eliminating: { en: 'Eliminating', fa: 'حذف سریع' },
    Voting8: { en: 'Voting (8)', fa: 'رای‌گیری ۸ نفره' },
    Voting4: { en: 'Voting (4)', fa: 'رای‌گیری ۴ نفره' },
    Voting2: { en: 'Voting (2)', fa: 'رای‌گیری ۲ نفره' },
    Finished: { en: 'Finished', fa: 'پایان یافته' },
  }
  return labels[status]?.[locale] || status
}

export function getGameStatusColor(status: string): string {
  const colors: Record<string, string> = {
    Buying: 'bg-green-500',
    CapReached: 'bg-yellow-500',
    VRF_Request: 'bg-blue-500',
    Eliminating: 'bg-orange-500',
    Voting8: 'bg-purple-500',
    Voting4: 'bg-purple-600',
    Voting2: 'bg-purple-700',
    Finished: 'bg-gray-500',
  }
  return colors[status] || 'bg-gray-400'
}
