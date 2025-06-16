import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

// Default settings
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

async function getSettings() {
  try {
    // Try to get settings from database using explicit column selection to avoid cache issues
    const settingsRecord = await prisma.$queryRawUnsafe(`
      SELECT 
        id,
        "maxFreeResumes",
        "maxFreeAIUsage", 
        "maxFreeExports",
        "maxBasicResumes",
        "maxBasicAIUsage",
        "maxBasicExports", 
        "maxProResumes",
        "maxProAIUsage",
        "maxProExports",
        "basicPlanPrice",
        "proPlanPrice",
        "maintenanceMode",
        "updatedAt"
      FROM "SystemSettings" 
      ORDER BY id LIMIT 1
    `) as any[]

    if (settingsRecord && settingsRecord.length > 0) {
      const dbSettings = settingsRecord[0]
      
      // Convert to the expected format
      const cleanSettings = {
        maxFreeResumes: dbSettings.maxFreeResumes || DEFAULT_SETTINGS.maxFreeResumes,
        maxFreeAIUsage: dbSettings.maxFreeAIUsage || DEFAULT_SETTINGS.maxFreeAIUsage,
        maxFreeExports: dbSettings.maxFreeExports || DEFAULT_SETTINGS.maxFreeExports,
        maxBasicResumes: dbSettings.maxBasicResumes || DEFAULT_SETTINGS.maxBasicResumes,
        maxBasicAIUsage: dbSettings.maxBasicAIUsage || DEFAULT_SETTINGS.maxBasicAIUsage,
        maxBasicExports: dbSettings.maxBasicExports || DEFAULT_SETTINGS.maxBasicExports,
        maxProResumes: dbSettings.maxProResumes !== undefined ? dbSettings.maxProResumes : DEFAULT_SETTINGS.maxProResumes,
        maxProAIUsage: dbSettings.maxProAIUsage !== undefined ? dbSettings.maxProAIUsage : DEFAULT_SETTINGS.maxProAIUsage,
        maxProExports: dbSettings.maxProExports !== undefined ? dbSettings.maxProExports : DEFAULT_SETTINGS.maxProExports,
        basicPlanPrice: dbSettings.basicPlanPrice || DEFAULT_SETTINGS.basicPlanPrice,
        proPlanPrice: dbSettings.proPlanPrice || DEFAULT_SETTINGS.proPlanPrice,
        maintenanceMode: dbSettings.maintenanceMode !== undefined ? dbSettings.maintenanceMode : DEFAULT_SETTINGS.maintenanceMode
      }
      return cleanSettings
    }
  } catch (error) {
    // Table might not exist, use defaults
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
    `

    // Add missing columns if they don't exist (for existing tables)
    const alterStatements = [
      'ALTER TABLE "SystemSettings" ADD COLUMN IF NOT EXISTS "maxFreeExports" INTEGER DEFAULT 20',
      'ALTER TABLE "SystemSettings" ADD COLUMN IF NOT EXISTS "maxBasicResumes" INTEGER DEFAULT 50',
      'ALTER TABLE "SystemSettings" ADD COLUMN IF NOT EXISTS "maxBasicAIUsage" INTEGER DEFAULT 500',
      'ALTER TABLE "SystemSettings" ADD COLUMN IF NOT EXISTS "maxBasicExports" INTEGER DEFAULT 100',
      'ALTER TABLE "SystemSettings" ADD COLUMN IF NOT EXISTS "maxProResumes" INTEGER DEFAULT -1',
      'ALTER TABLE "SystemSettings" ADD COLUMN IF NOT EXISTS "maxProAIUsage" INTEGER DEFAULT -1',
      'ALTER TABLE "SystemSettings" ADD COLUMN IF NOT EXISTS "maxProExports" INTEGER DEFAULT -1'
    ]

    for (const statement of alterStatements) {
      try {
        await prisma.$executeRawUnsafe(statement)
      } catch (error) {
        // Column might already exist, continue
        console.log(`Column might already exist: ${error}`)
      }
    }

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
            "maxFreeExports" = ${settings.maxFreeExports},
            "maxBasicResumes" = ${settings.maxBasicResumes},
            "maxBasicAIUsage" = ${settings.maxBasicAIUsage},
            "maxBasicExports" = ${settings.maxBasicExports},
            "maxProResumes" = ${settings.maxProResumes},
            "maxProAIUsage" = ${settings.maxProAIUsage},
            "maxProExports" = ${settings.maxProExports},
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
        ("maxFreeResumes", "maxFreeAIUsage", "maxFreeExports", "maxBasicResumes", "maxBasicAIUsage", "maxBasicExports", "maxProResumes", "maxProAIUsage", "maxProExports", "basicPlanPrice", "proPlanPrice", "maintenanceMode")
        VALUES (${settings.maxFreeResumes}, ${settings.maxFreeAIUsage}, ${settings.maxFreeExports}, ${settings.maxBasicResumes}, ${settings.maxBasicAIUsage}, ${settings.maxBasicExports}, ${settings.maxProResumes}, ${settings.maxProAIUsage}, ${settings.maxProExports}, ${settings.basicPlanPrice}, ${settings.proPlanPrice}, ${settings.maintenanceMode})
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
    console.log('Admin settings API returning:', settings)
    return NextResponse.json(settings)
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