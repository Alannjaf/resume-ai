'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'ar' | 'ckb'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Import translation files
const translations = {
  en: () => import('@/locales/en/common.json').then(m => m.default),
  ar: () => import('@/locales/ar/common.json').then(m => m.default),
  ckb: () => import('@/locales/ckb/common.json').then(m => m.default),
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const [messages, setMessages] = useState<any>({})

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translationLoader = translations[language]
        const loadedMessages = await translationLoader()
        setMessages(loadedMessages)
      } catch (error) {
        console.error('Failed to load translations:', error)
      }
    }

    loadTranslations()
  }, [language])

  // Simple translation function that supports nested keys
  const t = (key: string): string => {
    const keys = key.split('.')
    let value = messages
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  const isRTL = language === 'ar' || language === 'ckb'

  // Update document direction when language changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
      document.documentElement.lang = language
    }
  }, [language, isRTL])

  const value = {
    language,
    setLanguage,
    t,
    isRTL
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}