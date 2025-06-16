'use client'

import { useState, useEffect } from 'react'
import { Check, Star, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

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

export function Pricing() {
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
      } catch (error) {
        console.error('Error fetching pricing:', error)
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
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Start free and upgrade as you grow. All plans include multi-language support.
          </p>
          
          {/* Payment Available Banner */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Manual payment available via FIB transfer!</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p>Loading pricing...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-xl scale-105' : 'border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price === 0 ? 'Free' : `${plan.priceIQD.toLocaleString()} IQD`}
                    </span>
                    <span className="text-gray-600 ml-1">
                      {plan.price > 0 ? '/month' : ''}
                    </span>
                  </div>
                  <CardDescription className="mt-2 text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-4">
                  <Button 
                    variant={plan.name === 'Free' ? 'outline' : 'default'}
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
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Payment Methods */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-600 mb-4">
            Payment methods coming soon
          </p>
          <div className="flex justify-center items-center space-x-6 opacity-50">
            <div className="bg-white px-4 py-2 rounded border text-sm font-medium relative">
              FIB
              <div className="absolute -top-2 -right-2 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">Soon</div>
            </div>
            <div className="bg-white px-4 py-2 rounded border text-sm font-medium relative">
              Nasspay
              <div className="absolute -top-2 -right-2 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">Soon</div>
            </div>
            <div className="bg-white px-4 py-2 rounded border text-sm font-medium opacity-30">
              Visa
            </div>
            <div className="bg-white px-4 py-2 rounded border text-sm font-medium opacity-30">
              Mastercard
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-center mb-8">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-medium mb-2">Can I switch plans anytime?</h4>
              <p className="text-gray-600 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-medium mb-2">Do you support Kurdish and Arabic?</h4>
              <p className="text-gray-600 text-sm">Yes! We fully support Kurdish Sorani, Arabic, and English with proper RTL text direction.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-medium mb-2">Is there a free trial for paid plans?</h4>
              <p className="text-gray-600 text-sm">Our Free plan lets you try most features. You can upgrade anytime without losing your data.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}