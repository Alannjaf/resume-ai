import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { checkUserLimits } from '@/lib/db'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check export limits before allowing download
    const limits = await checkUserLimits(userId)
    
    if (!limits.canExport) {
      return NextResponse.json({ 
        error: 'Export limit reached. Please upgrade your plan.' 
      }, { status: 403 })
    }

    const { template, timestamp, userAgent } = await request.json()

    // Check if user can use the selected template
    if (!limits.availableTemplates.includes(template)) {
      return NextResponse.json({ 
        error: 'This template is not available for your current plan. Please upgrade to access premium templates.' 
      }, { status: 403 })
    }

    // Update export count in database using the subscription ID from the limits check
    await prisma.subscription.update({
      where: { id: limits.subscription.id },
      data: { exportCount: { increment: 1 } }
    })

    // Log download event
    console.log('PDF Download Event:', {
      userId,
      template,
      timestamp,
      userAgent: userAgent?.substring(0, 200), // Truncate for storage
      ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Download tracking error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}