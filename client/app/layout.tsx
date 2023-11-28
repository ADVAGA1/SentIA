import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import "@/app/globals.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SentIA',
  description: 'Sentiment analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="m-3 pt-4">{children}</body>
    </html>
  )
}
