import type { Metadata } from 'next'

import Header from './Header';
import "@/app/globals.css";
import { NextUIProvider } from '@nextui-org/react';

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
      <body className="m-3 pt-4">
        <Header />
        <div>
          {children}
        </div>
      </body>
    </html>
  )
}
