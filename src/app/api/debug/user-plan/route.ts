import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getCurrentUser } from '@/lib/db'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getCurrentUser()
    
    return NextResponse.json({
      clerkId: userId,
      dbUser: user ? {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        subscription: user.subscription ? {
          id: user.subscription.id,
          plan: user.subscription.plan,
          status: user.subscription.status,
          resumeCount: user.subscription.resumeCount,
          aiUsageCount: user.subscription.aiUsageCount,
          exportCount: user.subscription.exportCount,
          importCount: user.subscription.importCount || 0,
          startDate: user.subscription.startDate,
          endDate: user.subscription.endDate
        } : null
      } : null
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}