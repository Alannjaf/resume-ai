import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import { UserWithSubscription } from '@/types/api'

export async function GET() {
  try {
    await requireAdmin()

    const users = await prisma.user.findMany({
      include: {
        subscription: {
          select: {
            plan: true,
            status: true,
            resumeCount: true,
            aiUsageCount: true,
            exportCount: true,
            importCount: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Handle users that might not have role column yet
    const usersWithRole = users.map((user: UserWithSubscription) => ({
      ...user,
      role: user.role || 'USER'
    }))

    return NextResponse.json({ users: usersWithRole })
  } catch {
    return NextResponse.json({ 
      error: 'Unauthorized or failed to fetch users' 
    }, { status: 403 })
  }
}