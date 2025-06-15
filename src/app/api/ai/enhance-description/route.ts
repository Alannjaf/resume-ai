import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { AIService } from '@/lib/ai'
import { getCurrentUser, checkUserLimits } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check AI usage limits
    const { canUseAI } = await checkUserLimits(user.id)
    if (!canUseAI) {
      return NextResponse.json({ 
        error: 'AI usage limit reached. Please upgrade your plan.' 
      }, { status: 403 })
    }

    const body = await req.json()
    const { description, jobTitle, language } = body

    if (!description || !jobTitle) {
      return NextResponse.json({ error: 'Description and job title are required' }, { status: 400 })
    }

    const enhancedDescription = await AIService.enhanceJobDescription(
      description,
      jobTitle,
      { language: language || 'en' }
    )

    // Update AI usage count
    const { prisma } = await import('@/lib/prisma')
    await prisma.subscription.update({
      where: { userId: user.id },
      data: { aiUsageCount: { increment: 1 } }
    })

    return NextResponse.json({ enhancedDescription })
  } catch (error) {
    console.error('Error enhancing description:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to enhance description' 
    }, { status: 500 })
  }
}