import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getCurrentUser } from '@/lib/db'

// Development endpoint to reset AI usage count
export async function POST() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Reset AI usage count for development
    const { prisma } = await import('@/lib/prisma')
    await prisma.subscription.update({
      where: { userId: user.id },
      data: { 
        aiUsageCount: 0,
        exportCount: 0,
        resumeCount: 0
      }
    })

    return NextResponse.json({ 
      message: 'Usage counts reset successfully',
      userId: user.id
    })
  } catch {
    return NextResponse.json({ 
      error: 'Failed to reset usage counts' 
    }, { status: 500 })
  }
}