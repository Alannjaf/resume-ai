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
    const { jobTitle, industry, experience, skills, language } = body

    if (!jobTitle) {
      return NextResponse.json({ error: 'Job title is required' }, { status: 400 })
    }

    const summary = await AIService.generateProfessionalSummary({
      jobTitle,
      industry,
      experience,
      skills,
      language: language || 'en'
    })

    // Update AI usage count
    const { prisma } = await import('@/lib/prisma')
    await prisma.subscription.update({
      where: { userId: user.id },
      data: { aiUsageCount: { increment: 1 } }
    })

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Error generating summary:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate summary' 
    }, { status: 500 })
  }
}