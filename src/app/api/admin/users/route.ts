import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

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
            exportCount: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Handle users that might not have role column yet
    const usersWithRole = users.map(user => ({
      ...user,
      role: (user as any).role || 'USER'
    }))

    return NextResponse.json({ users: usersWithRole })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ 
      error: 'Unauthorized or failed to fetch users' 
    }, { status: 403 })
  }
}