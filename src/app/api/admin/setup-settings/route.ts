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
    
    console.log('Setting up SystemSettings table...')
    
    // Create table if it doesn't exist
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "SystemSettings" (
        id SERIAL PRIMARY KEY,
        "maxFreeResumes" INTEGER DEFAULT 10,
        "maxFreeAIUsage" INTEGER DEFAULT 100,
        "maxFreeExports" INTEGER DEFAULT 20,
        "maxBasicResumes" INTEGER DEFAULT 50,
        "maxBasicAIUsage" INTEGER DEFAULT 500,
        "maxBasicExports" INTEGER DEFAULT 100,
        "maxProResumes" INTEGER DEFAULT -1,
        "maxProAIUsage" INTEGER DEFAULT -1,
        "maxProExports" INTEGER DEFAULT -1,
        "basicPlanPrice" INTEGER DEFAULT 5000,
        "proPlanPrice" INTEGER DEFAULT 10000,
        "maintenanceMode" BOOLEAN DEFAULT FALSE,
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `)
    
    console.log('Table created successfully')

    // Check if any records exist
    const existingRecords = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM "SystemSettings"
    ` as any[]
    
    const recordCount = parseInt(existingRecords[0]?.count || '0')
    console.log('Existing records:', recordCount)
    
    if (recordCount === 0) {
      // Insert default settings
      console.log('Inserting default settings...')
      await prisma.$executeRaw`
        INSERT INTO "SystemSettings" 
        ("maxFreeResumes", "maxFreeAIUsage", "maxFreeExports", "maxBasicResumes", "maxBasicAIUsage", "maxBasicExports", "maxProResumes", "maxProAIUsage", "maxProExports", "basicPlanPrice", "proPlanPrice", "maintenanceMode")
        VALUES (${DEFAULT_SETTINGS.maxFreeResumes}, ${DEFAULT_SETTINGS.maxFreeAIUsage}, ${DEFAULT_SETTINGS.maxFreeExports}, ${DEFAULT_SETTINGS.maxBasicResumes}, ${DEFAULT_SETTINGS.maxBasicAIUsage}, ${DEFAULT_SETTINGS.maxBasicExports}, ${DEFAULT_SETTINGS.maxProResumes}, ${DEFAULT_SETTINGS.maxProAIUsage}, ${DEFAULT_SETTINGS.maxProExports}, ${DEFAULT_SETTINGS.basicPlanPrice}, ${DEFAULT_SETTINGS.proPlanPrice}, ${DEFAULT_SETTINGS.maintenanceMode})
      `
      console.log('Default settings inserted')
    }

    // Verify the setup by reading back the data
    const settings = await prisma.$queryRaw`
      SELECT * FROM "SystemSettings" LIMIT 1
    ` as any[]
    
    console.log('Current settings:', settings[0])
    
    return NextResponse.json({ 
      success: true, 
      message: 'SystemSettings table setup completed',
      settings: settings[0] || DEFAULT_SETTINGS,
      recordCount
    })
  } catch (error) {
    console.error('Error setting up SystemSettings:', error)
    return NextResponse.json({ 
      error: 'Failed to setup SystemSettings',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}