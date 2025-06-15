'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Copy, CheckCircle, Clock, Info, CreditCard } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

export default function PaymentInstructionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useUser()
  const [copied, setCopied] = useState<string | null>(null)
  const plan = searchParams.get('plan') || 'basic'

  const planDetails = {
    basic: {
      name: 'Basic',
      price: '$9',
      priceIQD: '13,500 IQD',
      features: [
        '5 Resumes',
        'All Template Options',
        'AI-Powered Content Generation',
        'PDF & DOC Export',
        'Priority Support'
      ]
    },
    pro: {
      name: 'Pro',
      price: '$19',
      priceIQD: '28,500 IQD',
      features: [
        'Unlimited Resumes',
        'All Premium Templates',
        'Unlimited AI Generation',
        'Advanced Export Options',
        'Custom Branding',
        '24/7 Priority Support'
      ]
    }
  }

  const selectedPlan = planDetails[plan as keyof typeof planDetails] || planDetails.basic

  const paymentInfo = {
    bankName: 'First Iraqi Bank (FIB)',
    accountName: 'Alan Jaf',
    accountNumber: 'YOUR_FIB_NUMBER_HERE', // TODO: Replace with your actual FIB number
    notes: `ResumeAI ${selectedPlan.name} - ${user?.emailAddresses[0]?.emailAddress}`
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/billing')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Billing
            </Button>
            <Badge variant="secondary">
              Manual Payment
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Instructions</h1>
          <p className="text-gray-600">Complete your {selectedPlan.name} plan upgrade</p>
        </div>

        {/* Selected Plan */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">{selectedPlan.name} Plan</h2>
              <p className="text-gray-600">Monthly subscription</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{selectedPlan.price}/mo</div>
              <div className="text-sm text-gray-600">{selectedPlan.priceIQD}/month</div>
            </div>
          </div>
          <div className="space-y-2">
            {selectedPlan.features.map((feature, i) => (
              <div key={i} className="flex items-center text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                {feature}
              </div>
            ))}
          </div>
        </Card>

        {/* Payment Steps */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">How to Pay</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Send Payment via FIB</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Transfer {selectedPlan.priceIQD} to the account details below
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Include Reference</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Add your email address in the payment notes/reference
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Activation</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Your plan will be activated within 24 hours after payment confirmation
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Bank Details */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-blue-50 to-purple-50">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Bank Account Details
          </h3>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Bank Name</p>
                  <p className="font-medium">{paymentInfo.bankName}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(paymentInfo.bankName, 'bank')}
                >
                  {copied === 'bank' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Account Name</p>
                  <p className="font-medium">{paymentInfo.accountName}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(paymentInfo.accountName, 'name')}
                >
                  {copied === 'name' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Account Number</p>
                  <p className="font-medium text-lg">{paymentInfo.accountNumber}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(paymentInfo.accountNumber, 'number')}
                >
                  {copied === 'number' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-medium text-lg text-primary">{selectedPlan.priceIQD}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(selectedPlan.priceIQD, 'amount')}
                >
                  {copied === 'amount' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    Reference/Notes (Important!)
                  </p>
                  <p className="font-medium text-sm mt-1">{paymentInfo.notes}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(paymentInfo.notes, 'notes')}
                  className="ml-2"
                >
                  {copied === 'notes' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Important Notes */}
        <Card className="p-6 bg-orange-50 border-orange-200">
          <h3 className="text-lg font-semibold mb-3 flex items-center text-orange-900">
            <Info className="h-5 w-5 mr-2" />
            Important Information
          </h3>
          <ul className="space-y-2 text-sm text-orange-800">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Please include your email address in the payment reference/notes</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Your subscription will be activated within 24 hours after payment confirmation</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>You'll receive an email confirmation when your plan is activated</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>For any issues, contact support at support@resumeai.app</span>
            </li>
          </ul>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/billing')}
          >
            Cancel
          </Button>
          <Button
            onClick={() => router.push('/dashboard')}
          >
            I've Completed Payment
          </Button>
        </div>
      </main>
    </div>
  )
}