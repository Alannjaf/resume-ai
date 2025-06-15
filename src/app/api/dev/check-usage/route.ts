import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getCurrentUser, checkUserLimits } from '@/lib/db'

// Development endpoint to check current usage
export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const limits = await checkUserLimits(user.id)

    return NextResponse.json({ 
      userId: user.id,
      subscription: limits.subscription,
      limits: {
        canCreateResume: limits.canCreateResume,
        canUseAI: limits.canUseAI,
        canExport: limits.canExport
      },
      usage: {
        resumeCount: limits.subscription?.resumeCount || 0,
        aiUsageCount: limits.subscription?.aiUsageCount || 0,
        exportCount: limits.subscription?.exportCount || 0
      }
    })
  } catch (error) {
    console.error('Error checking usage:', error)
    return NextResponse.json({ 
      error: 'Failed to check usage' 
    }, { status: 500 })
  }
}