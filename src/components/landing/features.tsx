'use client'

import { useEffect, useState, useRef } from 'react'
import { Sparkles, Languages, Palette, Download, Shield, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'

type FeatureType = {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  color: string
  bgColor: string
  gradient: string
}

const getFeatures = (t: (key: string) => string): FeatureType[] => [
  {
    icon: Sparkles,
    title: t('features.items.ai.title'),
    description: t('features.items.ai.description'),
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    icon: Languages,
    title: t('features.items.languages.title'),
    description: t('features.items.languages.description'),
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    icon: Palette,
    title: t('features.items.templates.title'),
    description: t('features.items.templates.description'),
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    icon: Download,
    title: t('features.items.export.title'),
    description: t('features.items.export.description'),
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    gradient: 'from-orange-500 to-red-600',
  },
  {
    icon: Zap,
    title: t('features.items.realtime.title'),
    description: t('features.items.realtime.description'),
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    gradient: 'from-yellow-500 to-amber-600',
  },
  {
    icon: Shield,
    title: t('features.items.ats.title'),
    description: t('features.items.ats.description'),
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    gradient: 'from-red-500 to-pink-600',
  },
]

function FeatureCard({ feature, index, isVisible }: { feature: FeatureType, index: number, isVisible: boolean }) {
  return (
    <Card 
      className={`
        relative overflow-hidden border-0 shadow-lg hover:shadow-2xl 
        transition-all duration-500 transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        hover:scale-105 hover:-translate-y-2
        group
      `}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Gradient accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      <CardHeader className="pb-4">
        <div className={`
          inline-flex items-center justify-center w-14 h-14 rounded-xl 
          ${feature.bgColor} mb-4
          bg-gradient-to-br ${feature.gradient}
          group-hover:scale-110 group-hover:rotate-3
          transition-transform duration-300
          shadow-sm
        `}>
          <feature.icon className={`h-7 w-7 text-white`} />
        </div>
        <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
          {feature.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-600 text-base leading-relaxed">
          {feature.description}
        </CardDescription>
      </CardContent>
      
      {/* Hover effect background */}
      <div className={`
        absolute inset-0 bg-gradient-to-br ${feature.gradient} 
        opacity-0 group-hover:opacity-5 transition-opacity duration-300
        pointer-events-none
      `}></div>
    </Card>
  )
}

export function Features() {
  const { t } = useLanguage()
  const features = getFeatures(t)
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(features.length).fill(false))
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards(new Array(features.length).fill(true))
          }
        })
      },
      { threshold: 0.1 }
    )

    const currentRef = sectionRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [features.length])

  return (
    <section ref={sectionRef} id="features" className="py-20 bg-gradient-to-b from-white to-gray-50/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900">
              {t('features.title')}
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              index={index}
              isVisible={visibleCards[index]}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
