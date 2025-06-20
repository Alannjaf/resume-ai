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
    let resumesLimit, aiUsageLimit, exportLimit, importLimit
    
    if (plan === 'FREE') {
      resumesLimit = settings.maxFreeResumes !== null && settings.maxFreeResumes !== undefined ? settings.maxFreeResumes : 10
      aiUsageLimit = settings.maxFreeAIUsage !== null && settings.maxFreeAIUsage !== undefined ? settings.maxFreeAIUsage : 100
      exportLimit = settings.maxFreeExports !== null && settings.maxFreeExports !== undefined ? settings.maxFreeExports : 20
      importLimit = settings.maxFreeImports !== null && settings.maxFreeImports !== undefined ? settings.maxFreeImports : 0
    } else if (plan === 'BASIC') {
      resumesLimit = settings.maxBasicResumes !== null && settings.maxBasicResumes !== undefined ? settings.maxBasicResumes : 50
      aiUsageLimit = settings.maxBasicAIUsage !== null && settings.maxBasicAIUsage !== undefined ? settings.maxBasicAIUsage : 500
      exportLimit = settings.maxBasicExports !== null && settings.maxBasicExports !== undefined ? settings.maxBasicExports : 100
      importLimit = settings.maxBasicImports !== null && settings.maxBasicImports !== undefined ? settings.maxBasicImports : 0
    } else { // PRO
      resumesLimit = settings.maxProResumes !== null && settings.maxProResumes !== undefined ? settings.maxProResumes : -1
      aiUsageLimit = settings.maxProAIUsage !== null && settings.maxProAIUsage !== undefined ? settings.maxProAIUsage : -1
      exportLimit = settings.maxProExports !== null && settings.maxProExports !== undefined ? settings.maxProExports : -1
      importLimit = settings.maxProImports !== null && settings.maxProImports !== undefined ? settings.maxProImports : -1
    }
    
    return NextResponse.json({
      currentPlan: plan,
      resumesUsed: user.subscription.resumeCount,
      resumesLimit,
      aiUsageCount: user.subscription.aiUsageCount,
      aiUsageLimit,
      exportCount: user.subscription.exportCount || 0,
      exportLimit,
      importCount: user.subscription.importCount || 0,
      importLimit
    })
  } catch (error) {
    console.error('Error fetching user subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}