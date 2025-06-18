import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// TEMPORARY ENDPOINT FOR TESTING - REMOVE IN PRODUCTION
export async function POST() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the user in our database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update or create Pro subscription
    await prisma.subscription.upsert({
      where: { userId: user.id },
      update: {
        plan: 'PRO',
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      },
      create: {
        userId: user.id,
        plan: 'PRO',
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully upgraded to PRO plan' 
    })
  } catch (error) {
    console.error('Error upgrading to PRO:', error)
    return NextResponse.json({ 
      error: 'Failed to upgrade to PRO' 
    }, { status: 500 })
  }
}