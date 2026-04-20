import React from "react"
import type { Metadata } from 'next'
import { DM_Sans, Kaushan_Script } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from "sonner";
import './globals.css'

const dmSans = DM_Sans({ subsets: ["latin"], variable: '--font-dm-sans' });

// Using Kaushan Script as a similar brush script font to Saltero
const kaushanScript = Kaushan_Script({ 
  weight: '400',
  subsets: ["latin"], 
  variable: '--font-Verdana',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Interview Prep Helper - Practice Interviews Like the Real Thing',
  description: 'Practice real interview questions under a timer, record your responses on video, review your performance, and improve with every attempt.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${kaushanScript.variable} font-sans antialiased`}>
        {children}
        <Toaster richColors position="top-right" />
        <Analytics />
      </body>
    </html>
  )
}
