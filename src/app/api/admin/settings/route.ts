import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'

// In a real app, these would be stored in a database
let systemSettings = {
  maxFreeResumes: 3,
  maxFreeAIUsage: 10,
  basicPlanPrice: 9.99,
  proPlanPrice: 19.99,
  maintenanceMode: false
}

export async function GET() {
  try {
    await requireAdmin()
    return NextResponse.json(systemSettings)
  } catch (error) {
    return NextResponse.json({ 
      error: 'Unauthorized' 
    }, { status: 403 })
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
    
    const settings = await req.json()
    systemSettings = { ...systemSettings, ...settings }
    
    // In a real app, save to database
    // await prisma.systemSettings.update({ ... })
    
    return NextResponse.json({ 
      success: true, 
      settings: systemSettings 
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Unauthorized or invalid data' 
    }, { status: 403 })
  }
}