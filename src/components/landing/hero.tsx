'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Languages, FileText, ArrowRight, ChevronDown } from 'lucide-react'
import { SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'

// Animated counter hook
function useCountUp(end: number, duration: number = 2000, start: number = 0) {
  const [count, setCount] = useState(start)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
          const startTime = Date.now()
          const range = end - start
          
          const updateCount = () => {
            const now = Date.now()
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            setCount(Math.floor(start + range * easeOutQuart))
            
            if (progress < 1) {
              requestAnimationFrame(updateCount)
            } else {
              setCount(end)
            }
          }
          updateCount()
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('stats-counter')
    if (element) observer.observe(element)
    
    return () => {
      if (element) observer.unobserve(element)
    }
  }, [end, duration, start, hasStarted])

  return count
}

export function Hero() {
  const { t } = useLanguage()
  const resumesCount = useCountUp(10000)
  const successRate = useCountUp(95)
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Enhanced gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            {/* Main Heading with gradient text */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900">
                {t('hero.title')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
              {t('hero.subtitle')}
            </p>

            {/* Feature highlights with better styling */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">{t('hero.features.ai')}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">{t('hero.features.templates')}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                <Languages className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">{t('hero.features.languages')}</span>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <SignedOut>
                <SignUpButton>
                  <Button 
                    size="lg" 
                    className="text-base px-8 py-6 h-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-200 font-semibold"
                  >
                    {t('hero.cta.primary')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button 
                    size="lg" 
                    className="text-base px-8 py-6 h-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-200 font-semibold"
                  >
                    {t('hero.cta.primary')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </SignedIn>
            </div>

            {/* Enhanced Social proof with animated counters */}
            <div id="stats-counter" className="mt-12 pt-8 border-t border-gray-200/50">
              <p className="text-sm text-gray-500 mb-6 font-medium">{t('hero.socialProof.trustedBy')}</p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-1">
                    {resumesCount.toLocaleString()}+
                  </div>
                  <div className="text-sm text-gray-500">{t('hero.socialProof.resumesCreated')}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 mb-1">
                    {successRate}%
                  </div>
                  <div className="text-sm text-gray-500">{t('hero.socialProof.successRate')}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-1">
                    3
                  </div>
                  <div className="text-sm text-gray-500">{t('hero.socialProof.languages')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced 3D Resume Preview */}
          <div className="mt-20 max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-8 -space-x-4 lg:-space-x-8">
              {/* Resume Card 1 */}
              <div className="relative transform rotate-12 hover:rotate-6 transition-all duration-500 hover:scale-110 hover:z-20 group">
                <div className="w-56 md:w-64 h-72 md:h-80 bg-white rounded-xl shadow-2xl border border-gray-100 p-6 transform-gpu backdrop-blur-sm group-hover:shadow-blue-500/20">
                  <div className="space-y-3">
                    <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded w-2/3"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    <div className="space-y-1.5 pt-2">
                      <div className="h-1.5 bg-gray-100 rounded w-full"></div>
                      <div className="h-1.5 bg-gray-100 rounded w-4/5"></div>
                      <div className="h-1.5 bg-gray-100 rounded w-3/4"></div>
                    </div>
                    <div className="pt-3">
                      <div className="h-2 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded w-1/3 mb-1"></div>
                      <div className="space-y-1">
                        <div className="h-1.5 bg-gray-100 rounded w-full"></div>
                        <div className="h-1.5 bg-gray-100 rounded w-5/6"></div>
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="h-2 bg-gradient-to-r from-green-400 to-green-500 rounded w-2/5 mb-1"></div>
                      <div className="space-y-1">
                        <div className="h-1.5 bg-gray-100 rounded w-full"></div>
                        <div className="h-1.5 bg-gray-100 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume Card 2 - Center (Featured) */}
              <div className="relative transform hover:scale-110 transition-all duration-500 z-10 group">
                <div className="w-56 md:w-64 h-72 md:h-80 bg-gradient-to-br from-white to-blue-50/30 rounded-xl shadow-2xl border-2 border-blue-200 p-6 transform-gpu backdrop-blur-sm group-hover:shadow-blue-500/30 group-hover:border-blue-300">
                  <div className="space-y-3">
                    <div className="h-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    <div className="space-y-1.5 pt-2">
                      <div className="h-1.5 bg-gray-100 rounded w-full"></div>
                      <div className="h-1.5 bg-gray-100 rounded w-5/6"></div>
                      <div className="h-1.5 bg-gray-100 rounded w-4/5"></div>
                    </div>
                    <div className="pt-3">
                      <div className="h-2 bg-gradient-to-r from-orange-400 to-orange-500 rounded w-2/5 mb-1"></div>
                      <div className="space-y-1">
                        <div className="h-1.5 bg-gray-100 rounded w-full"></div>
                        <div className="h-1.5 bg-gray-100 rounded w-4/5"></div>
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="h-2 bg-gradient-to-r from-teal-400 to-teal-500 rounded w-1/3 mb-1"></div>
                      <div className="space-y-1">
                        <div className="h-1.5 bg-gray-100 rounded w-full"></div>
                        <div className="h-1.5 bg-gray-100 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume Card 3 */}
              <div className="relative transform -rotate-12 hover:-rotate-6 transition-all duration-500 hover:scale-110 hover:z-20 group">
                <div className="w-56 md:w-64 h-72 md:h-80 bg-white rounded-xl shadow-2xl border border-gray-100 p-6 transform-gpu backdrop-blur-sm group-hover:shadow-pink-500/20">
                  <div className="space-y-3">
                    <div className="h-3 bg-gradient-to-r from-red-500 to-pink-600 rounded w-1/2"></div>
                    <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                    <div className="space-y-1.5 pt-2">
                      <div className="h-1.5 bg-gray-100 rounded w-full"></div>
                      <div className="h-1.5 bg-gray-100 rounded w-3/4"></div>
                      <div className="h-1.5 bg-gray-100 rounded w-5/6"></div>
                    </div>
                    <div className="pt-3">
                      <div className="h-2 bg-gradient-to-r from-pink-400 to-pink-500 rounded w-1/4 mb-1"></div>
                      <div className="space-y-1">
                        <div className="h-1.5 bg-gray-100 rounded w-full"></div>
                        <div className="h-1.5 bg-gray-100 rounded w-3/4"></div>
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="h-2 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded w-2/5 mb-1"></div>
                      <div className="space-y-1">
                        <div className="h-1.5 bg-gray-100 rounded w-full"></div>
                        <div className="h-1.5 bg-gray-100 rounded w-4/5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-gray-400" />
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
      `}</style>
    </section>
  )
}
