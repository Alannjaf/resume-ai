import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getCurrentUser } from '@/lib/db'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ 
        message: 'User not found in database. Please sign out and sign in again to sync.',
        clerkId: userId 
      }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Database connection successful!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscription: user.subscription,
      }
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({ 
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}