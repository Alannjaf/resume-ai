'use client'

import { Sparkles, Languages, Palette, Download, Shield, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'

const getFeatures = (t: (key: string) => string) => [
  {
    icon: Sparkles,
    title: t('features.items.ai.title'),
    description: t('features.items.ai.description'),
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'},
  {
    icon: Languages,
    title: t('features.items.languages.title'),
    description: t('features.items.languages.description'),
    color: 'text-green-600',
    bgColor: 'bg-green-100'},
  {
    icon: Palette,
    title: t('features.items.templates.title'),
    description: t('features.items.templates.description'),
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'},
  {
    icon: Download,
    title: t('features.items.export.title'),
    description: t('features.items.export.description'),
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'},
  {
    icon: Zap,
    title: t('features.items.realtime.title'),
    description: t('features.items.realtime.description'),
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'},
  {
    icon: Shield,
    title: t('features.items.ats.title'),
    description: t('features.items.ats.description'),
    color: 'text-red-600',
    bgColor: 'bg-red-100'},
]

export function Features() {
  const { t } = useLanguage()
  const features = getFeatures(t)
  
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.bgColor} mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}