'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, FileText, Languages } from 'lucide-react'
import { SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'

export function Hero() {
  const { t } = useLanguage()
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-indigo-100 opacity-20 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t('hero.title')}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm text-gray-600">
            <div className="flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
              {t('hero.features.ai')}
            </div>
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-blue-600" />
              {t('hero.features.templates')}
            </div>
            <div className="flex items-center">
              <Languages className="h-4 w-4 mr-2 text-blue-600" />
              {t('hero.features.languages')}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SignedOut>
              <SignUpButton>
                <Button size="lg" className="text-base px-8 py-3 h-auto">
                  {t('hero.cta.primary')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg" className="text-base px-8 py-3 h-auto">
                  {t('nav.dashboard')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </SignedIn>
            <Button variant="outline" size="lg" className="text-base px-8 py-3 h-auto">
              {t('hero.cta.secondary')}
            </Button>
          </div>

          {/* Social proof */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Trusted by professionals worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold text-gray-400">10K+</div>
              <div className="text-sm text-gray-400">Resumes Created</div>
              <div className="text-2xl font-bold text-gray-400">95%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
              <div className="text-2xl font-bold text-gray-400">3</div>
              <div className="text-sm text-gray-400">Languages</div>
            </div>
          </div>
        </div>

        {/* Preview mockup */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl transform rotate-1 opacity-10"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl border p-8 sm:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                  <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-100 rounded w-4/5"></div>
                  
                  <div className="pt-4">
                    <div className="h-3 bg-blue-200 rounded w-1/3 mb-2"></div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-100 rounded w-full"></div>
                      <div className="h-2 bg-gray-100 rounded w-4/5"></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="h-3 bg-blue-200 rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-100 rounded w-full"></div>
                    <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-100 rounded w-5/6"></div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="h-3 bg-indigo-200 rounded w-2/5 mb-2"></div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-100 rounded w-full"></div>
                      <div className="h-2 bg-gray-100 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}