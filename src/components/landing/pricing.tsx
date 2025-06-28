'use client'

import { useEffect, useState } from 'react'
import { Check, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'
import { translatePlanFeatures } from '@/lib/translate-features'

interface Plan {
  name: string
  price: number
  priceIQD: number
  description: string
  features: string[]
  buttonText: string
  popular: boolean
  available: boolean
}

// Function to translate plan data
const translatePlan = (plan: Plan, t: (key: string, values?: any) => string) => {
  return {
    ...plan,
    name: plan.name === 'Free' ? t('pricing.plans.free.name') : 
          plan.name === 'Basic' ? t('pricing.plans.basic.name') : 
          plan.name === 'Pro' ? t('pricing.plans.pro.name') : plan.name,
    description: plan.name === 'Free' ? t('pricing.plans.free.description') : 
                plan.name === 'Basic' ? t('pricing.plans.basic.description') : 
                plan.name === 'Pro' ? t('pricing.plans.pro.description') : plan.description,
    buttonText: plan.name === 'Free' ? t('pricing.plans.free.buttonText') : 
               plan.name === 'Basic' ? t('pricing.plans.basic.buttonText') : 
               plan.name === 'Pro' ? t('pricing.plans.pro.buttonText') : plan.buttonText,
    features: translatePlanFeatures(plan.features, t, 'pricing')
  }
}

export function Pricing() {
  const { t } = useLanguage()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch('/api/pricing')
        if (response.ok) {
          const data = await response.json()
          setPlans(data.plans)
        }
      } catch {
        // Error fetching pricing
      } finally {
        setLoading(false)
      }
    }

    fetchPricing()
  }, [])
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            {t('pricing.subtitle')}
          </p>
          
          {/* Payment Available Banner */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">{t('pricing.manualPaymentFib')}</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p>{t('common.loading')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const translatedPlan = translatePlan(plan, t)
              return (
              <Card key={index} className={`relative ${translatedPlan.popular ? 'border-primary shadow-xl scale-105' : 'border-gray-200'}`}>
                {translatedPlan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      {t('pricing.mostPopular')}
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {translatedPlan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {translatedPlan.price === 0 ? t('pricing.plans.free.name') : `${translatedPlan.priceIQD.toLocaleString()} IQD`}
                    </span>
                    <span className="text-gray-600 ml-1">
                      {translatedPlan.price > 0 ? `/${t('pricing.monthly')}` : ''}
                    </span>
                  </div>
                  <CardDescription className="mt-2 text-base">
                    {translatedPlan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {translatedPlan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-4">
                  <Button 
                    variant={translatedPlan.name === t('pricing.plans.free.name') ? 'outline' : 'default'}
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      if (plan.name === 'Free') {
                        window.location.href = '/sign-up'
                      } else {
                        window.location.href = '/billing'
                      }
                    }}
                  >
                    {translatedPlan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            )
            })}
          </div>
        )}

        {/* Payment Methods */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-600 mb-4">
            {t('pricing.paymentMethods.title')}
          </p>
          <div className="flex justify-center items-center space-x-6 opacity-50">
            <div className="bg-white px-4 py-2 rounded border text-sm font-medium relative">
              {t('pricing.paymentMethods.fib')}
              <div className="absolute -top-2 -right-2 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">{t('pricing.paymentMethods.soon')}</div>
            </div>
            <div className="bg-white px-4 py-2 rounded border text-sm font-medium relative">
              {t('pricing.paymentMethods.nasspay')}
              <div className="absolute -top-2 -right-2 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">{t('pricing.paymentMethods.soon')}</div>
            </div>
            <div className="bg-white px-4 py-2 rounded border text-sm font-medium opacity-30">
              {t('pricing.paymentMethods.visa')}
            </div>
            <div className="bg-white px-4 py-2 rounded border text-sm font-medium opacity-30">
              {t('pricing.paymentMethods.mastercard')}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-center mb-8">{t('pricing.faq.title')}</h3>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-medium mb-2">{t('pricing.faq.items.switchPlans.question')}</h4>
              <p className="text-gray-600 text-sm">{t('pricing.faq.items.switchPlans.answer')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-medium mb-2">{t('pricing.faq.items.languages.question')}</h4>
              <p className="text-gray-600 text-sm">{t('pricing.faq.items.languages.answer')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-medium mb-2">{t('pricing.faq.items.freeTrial.question')}</h4>
              <p className="text-gray-600 text-sm">{t('pricing.faq.items.freeTrial.answer')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}