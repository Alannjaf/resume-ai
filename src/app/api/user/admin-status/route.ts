import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { DatabaseQueryResult } from '@/types/api'

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
      ` as DatabaseQueryResult[]

      return NextResponse.json({ 
        isAdmin: user?.[0]?.role === 'ADMIN' 
      })
    } catch {
      // Role column might not exist yet
      return NextResponse.json({ isAdmin: false })
    }
  } catch {
    return NextResponse.json({ isAdmin: false })
  }
}