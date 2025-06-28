import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

// This endpoint can be called by external cron services like Vercel Cron, GitHub Actions, or any other scheduler
export async function GET() {
  try {
    // Optional: Add authentication for cron job security
    const headersList = await headers()
    const cronSecret = headersList.get('authorization')
    
    // You can set CRON_SECRET in your environment variables for security
    if (process.env.CRON_SECRET && cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Cron job started: Checking for expired subscriptions
    
    // Call the check-expired endpoint internally
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/subscriptions/check-expired`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'}})

    if (!response.ok) {
      throw new Error(`Failed to check expired subscriptions: ${response.statusText}`)
    }

    const _result = await response.json()
    
    // Cron job completed
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      result: _result
    })

  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: 'Cron job failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// POST method for manual triggering (admin only)
export async function POST() {
  try {
    // This would require admin authentication in a real scenario
    // Manual subscription check triggered
    
    // Call the check-expired endpoint internally
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/subscriptions/check-expired`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'}})

    if (!response.ok) {
      throw new Error(`Failed to check expired subscriptions: ${response.statusText}`)
    }

    const _result = await response.json()
    
    return NextResponse.json({
      success: true,
      message: 'Manual subscription check completed',
      timestamp: new Date().toISOString(),
      result: _result
    })

  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: 'Manual subscription check failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}