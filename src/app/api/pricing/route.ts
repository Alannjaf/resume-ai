import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function getSystemSettings() {
  try {
    console.log('Pricing API: Fetching settings from database...')
    const settingsRecord = await prisma.$queryRawUnsafe(`
      SELECT 
        "maxFreeResumes",
        "maxFreeAIUsage", 
        "maxFreeExports",
        "maxBasicResumes",
        "maxBasicAIUsage",
        "maxBasicExports", 
        "maxProResumes",
        "maxProAIUsage",
        "maxProExports",
        "basicPlanPrice",
        "proPlanPrice",
        "maintenanceMode"
      FROM "SystemSettings" 
      ORDER BY id LIMIT 1
    `) as any[]

    if (settingsRecord && settingsRecord.length > 0) {
      console.log('Pricing API: Found settings:', settingsRecord[0])
      return settingsRecord[0]
    }
    console.log('Pricing API: No settings found, using defaults')
  } catch (error) {
    console.log('Pricing API: Error fetching settings:', error)
  }
  
  const defaults = {
    // Free Plan Limits
    maxFreeResumes: 10,
    maxFreeAIUsage: 100,
    maxFreeExports: 20,
    
    // Basic Plan Limits
    maxBasicResumes: 50,
    maxBasicAIUsage: 500,
    maxBasicExports: 100,
    
    // Pro Plan Limits
    maxProResumes: -1,
    maxProAIUsage: -1,
    maxProExports: -1,
    
    // Pricing
    basicPlanPrice: 5000, // IQD
    proPlanPrice: 10000   // IQD
  }
  console.log('Pricing API: Returning defaults:', defaults)
  return defaults
}

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
          `${settings.maxFreeResumes || 10} resumes per month`,
          `${settings.maxFreeAIUsage || 100} AI suggestions per month`,
          `${settings.maxFreeExports || 20} exports per month`,
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
          `${settings.maxBasicResumes || 50} resumes per month`,
          `${settings.maxBasicAIUsage || 500} AI suggestions per month`,
          `${settings.maxBasicExports || 100} exports per month`,
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
    console.error('Error fetching pricing:', error)
    
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