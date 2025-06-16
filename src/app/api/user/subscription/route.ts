import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { checkUserLimits, getCurrentUser } from '@/lib/db'
import { prisma } from '@/lib/prisma'

async function getSystemSettings() {
  try {
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
        "proPlanPrice"
      FROM "SystemSettings" 
      ORDER BY id LIMIT 1
    `) as any[]

    if (settingsRecord && settingsRecord.length > 0) {
      return settingsRecord[0]
    }
  } catch (error) {
    // Silent error handling
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
    maxProExports: -1
  }
  console.log('User subscription API: Returning defaults:', defaults)
  return defaults
}

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getCurrentUser()
    if (!user || !user.subscription) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const settings = await getSystemSettings()
    const plan = user.subscription.plan
    
    // Get limits based on plan and admin settings
    let resumesLimit, aiUsageLimit, exportLimit
    
    if (plan === 'FREE') {
      resumesLimit = settings.maxFreeResumes || 10
      aiUsageLimit = settings.maxFreeAIUsage || 100
      exportLimit = settings.maxFreeExports || 20
    } else if (plan === 'BASIC') {
      resumesLimit = settings.maxBasicResumes || 50
      aiUsageLimit = settings.maxBasicAIUsage || 500
      exportLimit = settings.maxBasicExports || 100
    } else { // PRO
      resumesLimit = settings.maxProResumes || -1
      aiUsageLimit = settings.maxProAIUsage || -1
      exportLimit = settings.maxProExports || -1
    }
    
    return NextResponse.json({
      currentPlan: plan,
      resumesUsed: user.subscription.resumeCount,
      resumesLimit,
      aiUsageCount: user.subscription.aiUsageCount,
      aiUsageLimit,
      exportCount: user.subscription.exportCount || 0,
      exportLimit
    })
  } catch (error) {
    console.error('Error fetching user subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}