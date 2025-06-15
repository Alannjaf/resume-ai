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
        ADD COLUMN IF NOT EXISTS "role" TEXT DEFAULT 'USER'
      `
      console.log('Role column added successfully')
    } catch (e) {
      console.log('Error adding role column:', e)
    }

    // Add the constraint after column exists
    try {
      await prisma.$executeRaw`
        ALTER TABLE "User" 
        ALTER COLUMN "role" SET NOT NULL
      `
    } catch (e) {
      console.log('Error setting NOT NULL constraint:', e)
    }

    // Make alann.jaf@gmail.com an admin using raw SQL to bypass Prisma schema validation
    try {
      await prisma.$executeRaw`
        UPDATE "User" 
        SET "role" = 'ADMIN' 
        WHERE "email" = 'alann.jaf@gmail.com'
      `
      
      // Fetch the updated user
      const adminUser = await prisma.$queryRaw`
        SELECT * FROM "User" 
        WHERE "email" = 'alann.jaf@gmail.com'
        LIMIT 1
      `
      
      if (!adminUser || !Array.isArray(adminUser) || adminUser.length === 0) {
        throw new Error('User not found')
      }

      return NextResponse.json({
        success: true,
        message: 'Admin user created successfully',
        admin: {
          email: adminUser[0].email,
          role: adminUser[0].role
        }
      })
    } catch (updateError) {
      console.error('Error updating user:', updateError)
      throw updateError
    }
  } catch (error) {
    console.error('Error setting up admin:', error)
    return NextResponse.json({ 
      error: 'Failed to setup admin',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}