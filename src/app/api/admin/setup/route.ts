import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// This endpoint is to initially set up admin users
// It should be removed or secured after initial setup
export async function POST(req: Request) {
  try {
    // Get the current user
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check if the setup key is correct (for security)
    const { setupKey } = await req.json()
    if (setupKey !== 'resumeai-admin-setup-2024') {
      return NextResponse.json({ error: 'Invalid setup key' }, { status: 403 })
    }

    // First, add the role column if it doesn't exist
    try {
      await prisma.$executeRaw`
        ALTER TABLE "User" 
        ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'USER'
      `
    } catch (e) {
      // Column might already exist
      console.log('Role column might already exist')
    }

    // Make alann.jaf@gmail.com an admin
    const adminUser = await prisma.user.update({
      where: { email: 'alann.jaf@gmail.com' },
      data: { role: 'ADMIN' as any }
    })

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      admin: {
        email: adminUser.email,
        role: adminUser.role
      }
    })
  } catch (error) {
    console.error('Error setting up admin:', error)
    return NextResponse.json({ 
      error: 'Failed to setup admin',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}