import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Reset export count to 0
    await prisma.subscription.update({
      where: { userId },
      data: { exportCount: 0 }
    })

    return NextResponse.json({ message: 'Export count reset to 0' })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}