import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const now = new Date()
    
    // Find all active subscriptions that have passed their end date
    const expiredSubscriptions = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        plan: {
          in: ['BASIC', 'PRO']
        },
        endDate: {
          lte: now
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })

    console.log(`🔍 Found ${expiredSubscriptions.length} expired subscriptions`)

    if (expiredSubscriptions.length === 0) {
      return NextResponse.json({ 
        message: 'No expired subscriptions found',
        processed: 0
      })
    }

    // Downgrade expired subscriptions to FREE
    const downgradeResults = await Promise.allSettled(
      expiredSubscriptions.map(async (subscription) => {
        try {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
              plan: 'FREE',
              status: 'ACTIVE',
              endDate: null,
              // Keep usage counts as is - don't reset
            }
          })

          console.log(`✅ Downgraded user ${subscription.user.email} from ${subscription.plan} to FREE`)
          
          return {
            success: true,
            userId: subscription.userId,
            userEmail: subscription.user.email,
            previousPlan: subscription.plan,
            newPlan: 'FREE'
          }
        } catch (error) {
          console.error(`❌ Failed to downgrade user ${subscription.user.email}:`, error)
          return {
            success: false,
            userId: subscription.userId,
            userEmail: subscription.user.email,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
      })
    )

    const successful = downgradeResults.filter(result => 
      result.status === 'fulfilled' && result.value.success
    ).map(result => result.status === 'fulfilled' ? result.value : null)

    const failed = downgradeResults.filter(result => 
      result.status === 'rejected' || 
      (result.status === 'fulfilled' && !result.value.success)
    ).map(result => {
      if (result.status === 'rejected') {
        return { error: result.reason }
      }
      return result.value
    })

    return NextResponse.json({
      message: `Processed ${expiredSubscriptions.length} expired subscriptions`,
      processed: expiredSubscriptions.length,
      successful: successful.length,
      failed: failed.length,
      details: {
        successful,
        failed
      }
    })

  } catch (error) {
    console.error('Error checking expired subscriptions:', error)
    return NextResponse.json({ 
      error: 'Failed to check expired subscriptions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET endpoint to check expiration status without making changes
export async function GET() {
  try {
    const now = new Date()
    
    // Find all active subscriptions that have passed their end date
    const expiredSubscriptions = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        plan: {
          in: ['BASIC', 'PRO']
        },
        endDate: {
          lte: now
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })

    // Also get subscriptions expiring soon (within 3 days)
    const expiringSoon = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        plan: {
          in: ['BASIC', 'PRO']
        },
        endDate: {
          gt: now,
          lte: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      expired: {
        count: expiredSubscriptions.length,
        subscriptions: expiredSubscriptions.map(sub => ({
          userId: sub.userId,
          userEmail: sub.user.email,
          userName: sub.user.name,
          plan: sub.plan,
          endDate: sub.endDate,
          daysOverdue: Math.floor((now.getTime() - (sub.endDate?.getTime() || 0)) / (1000 * 60 * 60 * 24))
        }))
      },
      expiringSoon: {
        count: expiringSoon.length,
        subscriptions: expiringSoon.map(sub => ({
          userId: sub.userId,
          userEmail: sub.user.email,
          userName: sub.user.name,
          plan: sub.plan,
          endDate: sub.endDate,
          daysUntilExpiry: Math.floor(((sub.endDate?.getTime() || 0) - now.getTime()) / (1000 * 60 * 60 * 24))
        }))
      }
    })

  } catch (error) {
    console.error('Error checking subscription status:', error)
    return NextResponse.json({ 
      error: 'Failed to check subscription status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}