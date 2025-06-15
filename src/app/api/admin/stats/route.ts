import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    await requireAdmin()

    // Get statistics
    const [totalUsers, totalResumes, activeSubscriptions] = await Promise.all([
      prisma.user.count(),
      prisma.resume.count(),
      prisma.subscription.count({
        where: { status: 'ACTIVE' }
      })
    ])

    // Calculate revenue (simplified - you'd calculate from actual payments)
    const revenue = activeSubscriptions * 9.99 // Placeholder calculation

    return NextResponse.json({
      totalUsers,
      totalResumes,
      activeSubscriptions,
      revenue
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ 
      error: 'Unauthorized or failed to fetch stats' 
    }, { status: 403 })
  }
}