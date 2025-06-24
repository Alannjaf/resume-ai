'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AppHeader } from '@/components/shared/AppHeader'
import { Check, Clock, Star, CreditCard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { useSubscription } from '@/contexts/SubscriptionContext'

interface Plan {
  name: string
  price: number
  priceIQD: number
  description: string
  features: string[]
  buttonText: string
  popular: boolean
  available: boolean
  current?: boolean
  period?: string
  limitations?: string[]
}

interface UserStats {
  currentPlan: string
  resumesUsed: number
  resumesLimit: number
  aiUsageCount: number
  aiUsageLimit: number
  exportCount: number
  exportLimit: number
}

export default function BillingPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { subscription, isLoading: subscriptionLoading } = useSubscription()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch pricing plans
        const pricingResponse = await fetch('/api/pricing')
        if (pricingResponse.ok) {
          const pricingData = await pricingResponse.json()
          // Enhance API data with billing-specific properties
          const enhancedPlans = pricingData.plans.map((plan: Plan) => ({
            ...plan,
            period: plan.price === 0 ? 'forever' : 'month',
            limitations: plan.name === 'Free' 
              ? ['Limited AI suggestions', 'Basic templates only', 'No premium features']
              : plan.name === 'Basic'
              ? ['Limited AI usage per month', 'Standard export options']
              : []
          }))
          setPlans(enhancedPlans)
        }

        // Update current plan in plans array based on subscription context
        if (subscription) {
          setPlans(prev => prev.map(plan => ({
            ...plan,
            current: plan.name === subscription.plan
          })))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [subscription])

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader 
        title="Subscription & Billing"
        showBackButton={true}
        backButtonText={t('pages.resumeBuilder.backToDashboard')}
        backButtonHref="/dashboard"
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription & Billing</h1>
          <p className="text-gray-600">Choose the plan that works best for you</p>
        </div>

        {/* Manual Payment Banner */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center space-x-3">
            <CreditCard className="h-6 w-6 text-green-600" />
            <div className="text-center">
              <h2 className="text-lg font-semibold text-green-900">Manual Payment Available!</h2>
              <p className="text-green-700 mt-1">
                You can upgrade your plan by sending payment through FIB. 
                We'll activate your subscription manually within 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Current Plan Status */}
        {subscription && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
                <p className="text-gray-600">You are currently on the {subscription.plan} plan</p>
              </div>
              <Badge variant="secondary" className="px-3 py-1">
                {subscription.plan} Plan
              </Badge>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {subscription.resumeCount}/{subscription.resumeLimit === -1 ? '∞' : subscription.resumeLimit}
                </div>
                <div className="text-sm text-gray-600">Resumes Used</div>
                {subscription.resumeLimit !== -1 && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((subscription.resumeCount / subscription.resumeLimit) * 100, 100)}%` }}
                    ></div>
                  </div>
                )}
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {subscription.aiUsageCount}/{subscription.aiUsageLimit === -1 ? '∞' : subscription.aiUsageLimit}
                </div>
                <div className="text-sm text-gray-600">AI Usage</div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ 
                      width: subscription.aiUsageLimit === -1 
                        ? '100%' 
                        : `${Math.min((subscription.aiUsageCount / subscription.aiUsageLimit) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {subscription.exportCount}/{subscription.exportLimit === -1 ? '∞' : subscription.exportLimit}
                </div>
                <div className="text-sm text-gray-600">PDF Exports</div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ 
                      width: subscription.exportLimit === -1 
                        ? '100%' 
                        : `${Math.min((subscription.exportCount / subscription.exportLimit) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {subscription.photoUploadsCount}/{subscription.photoUploadsLimit === -1 ? '∞' : subscription.photoUploadsLimit}
                </div>
                <div className="text-sm text-gray-600">Photo Uploads</div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full" 
                    style={{ 
                      width: subscription.photoUploadsLimit === -1 
                        ? '100%' 
                        : `${Math.min((subscription.photoUploadsCount / subscription.photoUploadsLimit) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Plans */}
        {loading || subscriptionLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Loading pricing plans...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`p-6 relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {plan.price === 0 ? 'Free' : `${plan.priceIQD.toLocaleString()} IQD`}
                    </span>
                    {plan.period !== 'forever' && <span className="text-gray-600">/{plan.period}</span>}
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.current ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => router.push(`/billing/payment-instructions?plan=${plan.name.toLowerCase()}`)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Upgrade Now
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Payment Methods Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported Payment Methods</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg opacity-60">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">FIB</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">First Iraqi Bank (FIB)</h4>
                <p className="text-sm text-gray-600">Secure local payment for Iraqi users</p>
              </div>
              <Badge variant="outline" className="ml-auto">
                <Clock className="h-3 w-3 mr-1" />
                Soon
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg opacity-60">
              <div className="w-12 h-8 bg-gradient-to-r from-green-600 to-green-800 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">NP</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Nasspay</h4>
                <p className="text-sm text-gray-600">Alternative payment solution</p>
              </div>
              <Badge variant="outline" className="ml-auto">
                <Clock className="h-3 w-3 mr-1" />
                Soon
              </Badge>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> We're actively working on integrating these payment methods. 
              Once available, you'll be able to upgrade your plan seamlessly. We'll notify you as soon as payments are ready!
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}