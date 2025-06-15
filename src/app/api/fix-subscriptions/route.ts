import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Temporary endpoint to fix subscription issues
export async function POST(req: Request) {
  try {
    const { fixKey } = await req.json()
    
    // Security check
    if (fixKey !== 'fix-subs-2024') {
      return NextResponse.json({ error: 'Invalid key' }, { status: 403 })
    }

    // Get all users without proper subscriptions
    const users = await prisma.user.findMany({
      include: {
        subscription: true
      }
    })

    let fixed = 0
    let errors = 0

    for (const user of users) {
      try {
        if (!user.subscription) {
          // Create missing subscription
          await prisma.subscription.create({
            data: {
              userId: user.id,
              plan: 'FREE',
              status: 'ACTIVE',
            }
          })
          fixed++
          console.log(`Created subscription for user: ${user.email}`)
        }
      } catch (error) {
        console.error(`Error fixing subscription for ${user.email}:`, error)
        errors++
      }
    }

    // Also check for orphaned subscriptions with Clerk IDs
    const orphanedSubs = await prisma.$queryRaw`
      SELECT s.* 
      FROM "Subscription" s
      LEFT JOIN "User" u ON s."userId" = u.id
      WHERE u.id IS NULL
    ` as any[]

    console.log(`Found ${orphanedSubs.length} orphaned subscriptions`)

    return NextResponse.json({
      success: true,
      message: 'Subscriptions fixed',
      stats: {
        totalUsers: users.length,
        subscriptionsCreated: fixed,
        errors,
        orphanedSubscriptions: orphanedSubs.length
      }
    })
  } catch (error) {
    console.error('Error fixing subscriptions:', error)
    return NextResponse.json({ 
      error: 'Failed to fix subscriptions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}