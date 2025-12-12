import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { ClientProviders } from "@/components/providers/ClientProviders";
import "vazirmatn/Vazirmatn-font-face.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Participation Game | Decentralized Lottery on Arbitrum",
  description: "Join the most transparent and fair decentralized lottery on Arbitrum. Buy shares, participate in voting, and win big prizes with LUSD.",
  keywords: ["lottery", "decentralized", "arbitrum", "blockchain", "crypto", "LUSD"],
  openGraph: {
    title: "Participation Game",
    description: "Decentralized Lottery on Arbitrum",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const isRTL = locale === 'fa';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider messages={messages}>
          <ClientProviders locale={locale}>
            {children}
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
