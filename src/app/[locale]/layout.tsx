import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const locales = ['en', 'ar', 'ckb']

interface LocaleLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const { locale } = params
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) {
    notFound()
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages()

  // Set document direction based on locale
  const dir = locale === 'ar' || locale === 'ckb' ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir}>
      <body className={`${inter.className} ${dir === 'rtl' ? 'rtl' : 'ltr'}`}>
        <ClerkProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}