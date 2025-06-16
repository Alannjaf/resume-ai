import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

const DEFAULT_SETTINGS = {
  // Free Plan Limits
  maxFreeResumes: 10,
  maxFreeAIUsage: 100,
  maxFreeExports: 20,
  
  // Basic Plan Limits  
  maxBasicResumes: 50,
  maxBasicAIUsage: 500,
  maxBasicExports: 100,
  
  // Pro Plan Limits (-1 means unlimited)
  maxProResumes: -1,
  maxProAIUsage: -1, 
  maxProExports: -1,
  
  // Pricing
  basicPlanPrice: 5000, // IQD
  proPlanPrice: 10000, // IQD
  maintenanceMode: false
}

export async function POST() {
  try {
    await requireAdmin()
    
    console.log('Resetting SystemSettings to defaults...')
    
    // Update the existing record with default values
    await prisma.$executeRaw`
      UPDATE "SystemSettings" 
      SET "maxFreeResumes" = ${DEFAULT_SETTINGS.maxFreeResumes},
          "maxFreeAIUsage" = ${DEFAULT_SETTINGS.maxFreeAIUsage},
          "maxFreeExports" = ${DEFAULT_SETTINGS.maxFreeExports},
          "maxBasicResumes" = ${DEFAULT_SETTINGS.maxBasicResumes},
          "maxBasicAIUsage" = ${DEFAULT_SETTINGS.maxBasicAIUsage},
          "maxBasicExports" = ${DEFAULT_SETTINGS.maxBasicExports},
          "maxProResumes" = ${DEFAULT_SETTINGS.maxProResumes},
          "maxProAIUsage" = ${DEFAULT_SETTINGS.maxProAIUsage},
          "maxProExports" = ${DEFAULT_SETTINGS.maxProExports},
          "basicPlanPrice" = ${DEFAULT_SETTINGS.basicPlanPrice},
          "proPlanPrice" = ${DEFAULT_SETTINGS.proPlanPrice},
          "maintenanceMode" = ${DEFAULT_SETTINGS.maintenanceMode},
          "updatedAt" = NOW()
      WHERE id = 1
    `
    
    // Verify the reset
    const updatedSettings = await prisma.$queryRaw`
      SELECT * FROM "SystemSettings" LIMIT 1
    ` as any[]
    
    console.log('Settings reset successfully:', updatedSettings[0])
    
    return NextResponse.json({ 
      success: true, 
      message: 'Settings reset to defaults successfully',
      settings: updatedSettings[0]
    })
  } catch (error) {
    console.error('Error resetting settings:', error)
    return NextResponse.json({ 
      error: 'Failed to reset settings',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}