import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { template, timestamp, userAgent } = await request.json()

    // Log download event (you can store this in database)
    console.log('PDF Download Event:', {
      userId,
      template,
      timestamp,
      userAgent: userAgent?.substring(0, 200), // Truncate for storage
      ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    })

    // TODO: Store in database when you have it set up
    // await db.downloadLog.create({
    //   data: {
    //     userId,
    //     template,
    //     timestamp: new Date(timestamp),
    //     userAgent,
    //     ip: request.ip || request.headers.get('x-forwarded-for')
    //   }
    // })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Download tracking error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}