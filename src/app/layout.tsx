import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'
import { Toaster } from 'react-hot-toast'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Work.krd - Create Professional Resumes with AI',
  description: 'Build stunning resumes with AI assistance in multiple languages including Kurdish, Arabic, and English.'}

export default function RootLayout({
  children}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      signInForceRedirectUrl="/dashboard"
      signUpForceRedirectUrl="/dashboard"
    >
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        </head>
        <body className={inter.className}>
          <SubscriptionProvider>
            <LanguageProvider>
              {children}
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff'},
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#4aed88',
                      secondary: '#fff'}},
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#ff4b4b',
                      secondary: '#fff'}}}}
              />
            </LanguageProvider>
          </SubscriptionProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}