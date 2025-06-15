'use client'

import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Check, Clock, Crown, Star, CreditCard } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BillingPage() {
  const router = useRouter()

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        '1 Resume',
        '3 Template Options', 
        'Basic Export (PDF)',
        'Standard Support'
      ],
      limitations: [
        'Limited AI suggestions',
        'Basic templates only',
        'No premium features'
      ],
      current: true,
      popular: false
    },
    {
      name: 'Basic',
      price: '$9',
      period: 'month',
      description: 'Great for job seekers',
      features: [
        '5 Resumes',
        'All Template Options',
        'AI-Powered Content Generation',
        'PDF & DOC Export',
        'Priority Support',
        'Resume Analytics'
      ],
      limitations: [
        'Limited AI usage (50/month)',
        'Standard export options'
      ],
      current: false,
      popular: true
    },
    {
      name: 'Pro',
      price: '$19',
      period: 'month', 
      description: 'For professionals and agencies',
      features: [
        'Unlimited Resumes',
        'All Premium Templates',
        'Unlimited AI Generation',
        'Advanced Export Options',
        'Custom Branding',
        'Resume Sharing Links',
        '24/7 Priority Support',
        'Advanced Analytics',
        'Version History'
      ],
      limitations: [],
      current: false,
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <span className="text-sm font-bold">RA</span>
                </div>
                <span className="text-xl font-bold">ResumeAI</span>
              </div>
            </div>
            <UserButton />
          </div>
        </div>
      </header>

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
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
              <p className="text-gray-600">You are currently on the Free plan</p>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              Free Plan
            </Badge>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">1/1</div>
              <div className="text-sm text-gray-600">Resumes Used</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">3</div>
              <div className="text-sm text-gray-600">Templates Available</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">∞</div>
              <div className="text-sm text-gray-600">Export Downloads</div>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
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
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
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