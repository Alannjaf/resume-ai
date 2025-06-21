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
                  {t('hero.cta.primary')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </SignedIn>
          </div>

          {/* Social proof */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">{t('hero.socialProof.trustedBy')}</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold text-gray-400">10K+</div>
              <div className="text-sm text-gray-400">{t('hero.socialProof.resumesCreated')}</div>
              <div className="text-2xl font-bold text-gray-400">95%</div>
              <div className="text-sm text-gray-400">{t('hero.socialProof.successRate')}</div>
              <div className="text-2xl font-bold text-gray-400">3</div>
              <div className="text-sm text-gray-400">{t('hero.socialProof.languages')}</div>
            </div>
          </div>
        </div>

        {/* 3D Resume Preview */}
        <div className="mt-16 max-w-6xl mx-auto perspective-1000">
          <div className="flex flex-wrap justify-center items-center gap-8 -space-x-4">
            {/* Resume Card 1 */}
            <div className="relative transform rotate-12 hover:rotate-6 transition-transform duration-300">
              <div className="w-64 h-80 bg-white rounded-lg shadow-2xl border border-gray-200 p-6 transform-gpu">
                <div className="space-y-3">
                  <div className="h-3 bg-blue-600 rounded w-2/3"></div>
                  <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                  <div className="space-y-1 pt-2">
                    <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                    <div className="h-1.5 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-1.5 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="pt-3">
                    <div className="h-2 bg-indigo-500 rounded w-1/3 mb-1"></div>
                    <div className="space-y-1">
                      <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                      <div className="h-1.5 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="h-2 bg-green-500 rounded w-2/5 mb-1"></div>
                    <div className="space-y-1">
                      <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                      <div className="h-1.5 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Card 2 - Center */}
            <div className="relative transform hover:scale-105 transition-transform duration-300 z-10">
              <div className="w-64 h-80 bg-white rounded-lg shadow-2xl border border-gray-200 p-6 transform-gpu">
                <div className="space-y-3">
                  <div className="h-4 bg-purple-600 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                  <div className="space-y-1 pt-2">
                    <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                    <div className="h-1.5 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-1.5 bg-gray-200 rounded w-4/5"></div>
                  </div>
                  <div className="pt-3">
                    <div className="h-2 bg-orange-500 rounded w-2/5 mb-1"></div>
                    <div className="space-y-1">
                      <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                      <div className="h-1.5 bg-gray-200 rounded w-4/5"></div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="h-2 bg-teal-500 rounded w-1/3 mb-1"></div>
                    <div className="space-y-1">
                      <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                      <div className="h-1.5 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Card 3 */}
            <div className="relative transform -rotate-12 hover:-rotate-6 transition-transform duration-300">
              <div className="w-64 h-80 bg-white rounded-lg shadow-2xl border border-gray-200 p-6 transform-gpu">
                <div className="space-y-3">
                  <div className="h-3 bg-red-600 rounded w-1/2"></div>
                  <div className="h-2 bg-gray-300 rounded w-2/3"></div>
                  <div className="space-y-1 pt-2">
                    <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                    <div className="h-1.5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-1.5 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="pt-3">
                    <div className="h-2 bg-pink-500 rounded w-1/4 mb-1"></div>
                    <div className="space-y-1">
                      <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                      <div className="h-1.5 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="h-2 bg-cyan-500 rounded w-2/5 mb-1"></div>
                    <div className="space-y-1">
                      <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                      <div className="h-1.5 bg-gray-200 rounded w-4/5"></div>
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