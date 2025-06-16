'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'ar' | 'ckb'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Import translation files
const translations = {
  en: () => import('@/locales/en/common.json').then(m => m.default),
  ar: () => import('@/locales/ar/common.json').then(m => m.default),
  ckb: () => import('@/locales/ckb/common.json').then(m => m.default),
}

// Pre-import English translations for faster initial load
import enTranslations from '@/locales/en/common.json'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const [messages, setMessages] = useState<any>(enTranslations)
  const [isLoading, setIsLoading] = useState(false)

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      // Skip loading for English since it's pre-loaded
      if (language === 'en') {
        setMessages(enTranslations)
        return
      }
      
      setIsLoading(true)
      try {
        const translationLoader = translations[language]
        const loadedMessages = await translationLoader()
        setMessages(loadedMessages)
      } catch (error) {
        console.error('Failed to load translations:', error)
        // Fallback to English on error
        setMessages(enTranslations)
      } finally {
        setIsLoading(false)
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

  // Mark document as ready when translations are loaded
  useEffect(() => {
    if (typeof document !== 'undefined' && Object.keys(messages).length > 0) {
      document.documentElement.classList.add('ready')
    }
  }, [messages])

  const value = {
    language,
    setLanguage,
    t,
    isRTL,
    isLoading
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