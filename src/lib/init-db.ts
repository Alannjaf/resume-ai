import { prisma } from './prisma'

export async function initializeDatabase() {
  try {
    // Create SystemSettings table if it doesn't exist
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

    // Check if SystemSettings has any records
    const settingsCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM "SystemSettings"
    ` as any[]

    // If no records exist, insert the default record
    if (settingsCount[0].count === '0' || settingsCount[0].count === 0) {
      await prisma.$executeRaw`
        INSERT INTO "SystemSettings" 
        ("maxFreeResumes", "maxFreeAIUsage", "maxFreeExports", "maxBasicResumes", "maxBasicAIUsage", "maxBasicExports", "maxProResumes", "maxProAIUsage", "maxProExports", "basicPlanPrice", "proPlanPrice", "maintenanceMode")
        VALUES (10, 100, 20, 50, 500, 100, -1, -1, -1, 5000, 10000, FALSE)
      `
      console.log('Initialized SystemSettings with default values')
    }
  } catch (error) {
    console.error('Error initializing database:', error)
  }
}