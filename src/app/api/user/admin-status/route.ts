import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ isAdmin: false })
    }

    // Try to get user with role, fallback to checking if column exists
    try {
      const user = await prisma.$queryRaw`
        SELECT "role" FROM "User" 
        WHERE "clerkId" = ${userId}
        LIMIT 1
      ` as any[]

      return NextResponse.json({ 
        isAdmin: user?.[0]?.role === 'ADMIN' 
      })
    } catch (e) {
      // Role column might not exist yet
      return NextResponse.json({ isAdmin: false })
    }
  } catch (error) {
    return NextResponse.json({ isAdmin: false })
  }
}