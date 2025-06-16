import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { LanguageProvider } from '@/contexts/LanguageContext'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ResumeAI - Create Professional Resumes with AI',
  description: 'Build stunning resumes with AI assistance in multiple languages including Kurdish, Arabic, and English.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}