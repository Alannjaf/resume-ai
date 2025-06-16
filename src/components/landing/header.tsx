'use client'

import { useState } from 'react'
import { Menu, X, Globe } from 'lucide-react'
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ckb', name: 'Kurdish', nativeName: 'کوردی' },
] as const

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleLangMenu = () => setIsLangMenuOpen(!isLangMenuOpen)
  
  const changeLanguage = (languageCode: 'en' | 'ar' | 'ckb') => {
    setLanguage(languageCode)
    setIsLangMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-sm font-bold">RA</span>
          </div>
          <span className="text-xl font-bold">ResumeAI</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.features')}
          </a>
          <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.pricing')}
          </a>
          <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.about')}
          </a>
          <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.contact')}
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Language Selector */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLangMenu}
              className="flex items-center space-x-2"
            >
              <Globe className="h-4 w-4" />
              <span>{languages.find(lang => lang.code === language)?.nativeName}</span>
            </Button>
            
            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md border bg-background shadow-lg">
                <div className="py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code as 'en' | 'ar' | 'ckb')}
                      className={cn(
                        "block w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground",
                        language === lang.code && "bg-accent text-accent-foreground"
                      )}
                    >
                      {lang.nativeName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <SignedOut>
            <SignInButton>
              <Button variant="ghost" size="sm">
                {t('nav.signIn')}
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button size="sm">
                {t('nav.signUp')}
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <nav className="space-y-4">
              <a href="#features" className="block text-sm font-medium hover:text-primary transition-colors">
                {t('nav.features')}
              </a>
              <a href="#pricing" className="block text-sm font-medium hover:text-primary transition-colors">
                {t('nav.pricing')}
              </a>
              <a href="#about" className="block text-sm font-medium hover:text-primary transition-colors">
                {t('nav.about')}
              </a>
              <a href="#contact" className="block text-sm font-medium hover:text-primary transition-colors">
                {t('nav.contact')}
              </a>
            </nav>
            
            <div className="border-t pt-4 space-y-4">
              {/* Mobile Language Selector */}
              <div>
                <p className="text-sm font-medium mb-2">Language</p>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code as 'en' | 'ar' | 'ckb')}
                      className={cn(
                        "block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                        language === lang.code && "bg-accent text-accent-foreground"
                      )}
                    >
                      {lang.nativeName}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <SignedOut>
                  <SignInButton>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      {t('nav.signIn')}
                    </Button>
                  </SignInButton>
                  <SignUpButton>
                    <Button size="sm" className="w-full">
                      {t('nav.signUp')}
                    </Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <div className="flex justify-center">
                    <UserButton />
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}