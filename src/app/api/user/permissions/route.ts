import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { checkUserLimits } from '@/lib/db'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const limits = await checkUserLimits(userId)
    
    return NextResponse.json({
      canUploadPhoto: limits.canUploadPhoto,
      availableTemplates: limits.availableTemplates
    })
  } catch (error) {
    console.error('Error fetching user permissions:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch permissions' 
    }, { status: 500 })
  }
}