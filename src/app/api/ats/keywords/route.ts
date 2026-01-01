import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { checkUserLimits } from '@/lib/db'
import { AIService } from '@/lib/ai'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check user limits for ATS
    const limits = await checkUserLimits(userId)
    
    if (!limits.subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    if (!limits.canUseATS) {
      return NextResponse.json({ 
        error: 'ATS check limit reached. Please upgrade your plan.',
        limit: limits.atsLimit,
        used: limits.atsUsed
      }, { status: 403 })
    }

    const body = await request.json()
    const { resumeData, jobDescription } = body

    if (!resumeData) {
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 })
    }

    if (!jobDescription || jobDescription.trim().length < 50) {
      return NextResponse.json({ 
        error: 'Job description is required (minimum 50 characters)' 
      }, { status: 400 })
    }

    // Match keywords
    const result = await AIService.matchKeywords(resumeData, jobDescription)

    // Increment ATS usage count
    await prisma.subscription.update({
      where: { id: limits.subscription.id },
      data: { atsUsageCount: { increment: 1 } }
    })

    return NextResponse.json({
      ...result,
      usage: {
        used: limits.atsUsed + 1,
        limit: limits.atsLimit
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to match keywords' },
      { status: 500 }
    )
  }
}

