import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

// Default settings
const DEFAULT_SETTINGS = {
  maxFreeResumes: 10,
  maxFreeAIUsage: 100,
  basicPlanPrice: 5000, // IQD
  proPlanPrice: 10000, // IQD
  maintenanceMode: false
}

async function getSettings() {
  try {
    // Try to get settings from database
    const settingsRecord = await prisma.$queryRaw`
      SELECT * FROM "SystemSettings" LIMIT 1
    ` as any[]

    if (settingsRecord && settingsRecord.length > 0) {
      return settingsRecord[0]
    }
  } catch (error) {
    // Table might not exist, use defaults
    console.log('Settings table not found, using defaults')
  }
  
  return DEFAULT_SETTINGS
}

async function saveSettings(settings: any) {
  try {
    // Create table if it doesn't exist
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "SystemSettings" (
        id SERIAL PRIMARY KEY,
        "maxFreeResumes" INTEGER DEFAULT 10,
        "maxFreeAIUsage" INTEGER DEFAULT 100,
        "basicPlanPrice" INTEGER DEFAULT 5000,
        "proPlanPrice" INTEGER DEFAULT 10000,
        "maintenanceMode" BOOLEAN DEFAULT FALSE,
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `

    // Check if record exists
    const existingRecord = await prisma.$queryRaw`
      SELECT id FROM "SystemSettings" LIMIT 1
    ` as any[]

    if (existingRecord && existingRecord.length > 0) {
      // Update existing record
      await prisma.$executeRaw`
        UPDATE "SystemSettings" 
        SET "maxFreeResumes" = ${settings.maxFreeResumes},
            "maxFreeAIUsage" = ${settings.maxFreeAIUsage},
            "basicPlanPrice" = ${settings.basicPlanPrice},
            "proPlanPrice" = ${settings.proPlanPrice},
            "maintenanceMode" = ${settings.maintenanceMode},
            "updatedAt" = NOW()
        WHERE id = ${existingRecord[0].id}
      `
    } else {
      // Insert new record
      await prisma.$executeRaw`
        INSERT INTO "SystemSettings" 
        ("maxFreeResumes", "maxFreeAIUsage", "basicPlanPrice", "proPlanPrice", "maintenanceMode")
        VALUES (${settings.maxFreeResumes}, ${settings.maxFreeAIUsage}, ${settings.basicPlanPrice}, ${settings.proPlanPrice}, ${settings.maintenanceMode})
      `
    }

    return settings
  } catch (error) {
    console.error('Error saving settings:', error)
    throw error
  }
}

export async function GET() {
  try {
    await requireAdmin()
    const settings = await getSettings()
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ 
      error: 'Unauthorized' 
    }, { status: 403 })
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
    
    const newSettings = await req.json()
    const savedSettings = await saveSettings(newSettings)
    
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