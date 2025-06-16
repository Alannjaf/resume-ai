import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { getSystemSettings, updateSystemSettings } from '@/lib/system-settings'

export async function GET() {
  try {
    await requireAdmin()
    const settings = await getSystemSettings()
    
    // Return only the fields we need
    return NextResponse.json({
      maxFreeResumes: settings.maxFreeResumes,
      maxFreeAIUsage: settings.maxFreeAIUsage,
      maxFreeExports: settings.maxFreeExports,
      maxBasicResumes: settings.maxBasicResumes,
      maxBasicAIUsage: settings.maxBasicAIUsage,
      maxBasicExports: settings.maxBasicExports,
      maxProResumes: settings.maxProResumes,
      maxProAIUsage: settings.maxProAIUsage,
      maxProExports: settings.maxProExports,
      basicPlanPrice: settings.basicPlanPrice,
      proPlanPrice: settings.proPlanPrice,
      maintenanceMode: settings.maintenanceMode
    })
  } catch (error) {
    console.error('Admin settings API error:', error)
    return NextResponse.json({ 
      error: 'Unauthorized' 
    }, { status: 403 })
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
    
    const newSettings = await req.json()
    const savedSettings = await updateSystemSettings(newSettings)
    
    return NextResponse.json({ 
      success: true, 
      settings: savedSettings 
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ 
      error: 'Failed to update settings' 
    }, { status: 500 })
  }
}