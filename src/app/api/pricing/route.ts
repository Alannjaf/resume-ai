import { NextResponse } from 'next/server'
import { getSystemSettings } from '@/lib/system-settings'

export async function GET() {
  try {
    const settings = await getSystemSettings()
    
    const plans = [
      {
        name: 'Free',
        price: 0,
        priceIQD: 0,
        description: 'Perfect for getting started',
        features: [
          `${settings.maxFreeResumes !== null && settings.maxFreeResumes !== undefined ? settings.maxFreeResumes : 10} resumes per month`,
          `${settings.maxFreeAIUsage !== null && settings.maxFreeAIUsage !== undefined ? settings.maxFreeAIUsage : 100} AI suggestions per month`,
          `${settings.maxFreeExports !== null && settings.maxFreeExports !== undefined ? settings.maxFreeExports : 20} exports per month`,
          'Basic templates',
          'PDF export'
        ],
        buttonText: 'Get Started Free',
        popular: false,
        available: true
      },
      {
        name: 'Basic',
        price: settings.basicPlanPrice || 5000,
        priceIQD: settings.basicPlanPrice || 5000,
        description: 'Great for job seekers',
        features: [
          `${settings.maxBasicResumes !== null && settings.maxBasicResumes !== undefined ? settings.maxBasicResumes : 50} resumes per month`,
          `${settings.maxBasicAIUsage !== null && settings.maxBasicAIUsage !== undefined ? settings.maxBasicAIUsage : 500} AI suggestions per month`,
          `${settings.maxBasicExports !== null && settings.maxBasicExports !== undefined ? settings.maxBasicExports : 100} exports per month`,
          'All template options',
          'Advanced AI enhancement',
          'PDF & DOCX export',
          'Priority support'
        ],
        buttonText: 'Upgrade Now',
        popular: false,
        available: true
      },
      {
        name: 'Pro',
        price: settings.proPlanPrice || 10000,
        priceIQD: settings.proPlanPrice || 10000,
        description: 'Best for professionals',
        features: [
          settings.maxProResumes === -1 ? 'Unlimited resumes' : `${settings.maxProResumes} resumes per month`,
          settings.maxProAIUsage === -1 ? 'Unlimited AI processing' : `${settings.maxProAIUsage} AI suggestions per month`,
          settings.maxProExports === -1 ? 'Unlimited exports' : `${settings.maxProExports} exports per month`,
          'All premium templates',
          'Multiple export formats',
          'Custom branding',
          'Priority support',
          'Advanced analytics'
        ],
        buttonText: 'Upgrade Now',
        popular: true,
        available: true
      }
    ]

    return NextResponse.json({ plans })
  } catch (error) {
    
    // Return default pricing on error
    const defaultPlans = [
      {
        name: 'Free',
        price: 0,
        priceIQD: 0,
        description: 'Perfect for getting started',
        features: ['10 resumes per month', '100 AI suggestions per month', '20 exports per month', 'Basic templates', 'PDF export'],
        buttonText: 'Get Started Free',
        popular: false,
        available: true
      },
      {
        name: 'Basic',
        price: 5000,
        priceIQD: 5000,
        description: 'Great for job seekers',
        features: ['50 resumes per month', '500 AI suggestions per month', '100 exports per month', 'All template options', 'Advanced AI enhancement', 'PDF & DOCX export', 'Priority support'],
        buttonText: 'Upgrade Now',
        popular: false,
        available: true
      },
      {
        name: 'Pro',
        price: 10000,
        priceIQD: 10000,
        description: 'Best for professionals',
        features: ['Unlimited resumes', 'Unlimited AI processing', 'Unlimited exports', 'All premium templates', 'Multiple export formats', 'Custom branding', 'Priority support', 'Advanced analytics'],
        buttonText: 'Upgrade Now',
        popular: true,
        available: true
      }
    ]
    
    return NextResponse.json({ plans: defaultPlans })
  }
}