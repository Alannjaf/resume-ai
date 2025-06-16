import { prisma } from './prisma'

export async function getSystemSettings() {
  try {
    // Try to get the first (and should be only) settings record
    let settings = await prisma.systemSettings.findFirst()
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          maxFreeResumes: 10,
          maxFreeAIUsage: 100,
          maxFreeExports: 20,
          maxBasicResumes: 50,
          maxBasicAIUsage: 500,
          maxBasicExports: 100,
          maxProResumes: -1,
          maxProAIUsage: -1,
          maxProExports: -1,
          basicPlanPrice: 5000,
          proPlanPrice: 10000,
          maintenanceMode: false
        }
      })
    }
    
    return settings
  } catch (error) {
    console.error('Error getting system settings:', error)
    // Return default settings on error
    return {
      id: 1,
      maxFreeResumes: 10,
      maxFreeAIUsage: 100,
      maxFreeExports: 20,
      maxBasicResumes: 50,
      maxBasicAIUsage: 500,
      maxBasicExports: 100,
      maxProResumes: -1,
      maxProAIUsage: -1,
      maxProExports: -1,
      basicPlanPrice: 5000,
      proPlanPrice: 10000,
      maintenanceMode: false,
      updatedAt: new Date()
    }
  }
}

export async function updateSystemSettings(data: any) {
  try {
    // Get the existing settings
    const existing = await prisma.systemSettings.findFirst()
    
    if (existing) {
      // Update existing settings
      return await prisma.systemSettings.update({
        where: { id: existing.id },
        data: {
          maxFreeResumes: data.maxFreeResumes,
          maxFreeAIUsage: data.maxFreeAIUsage,
          maxFreeExports: data.maxFreeExports,
          maxBasicResumes: data.maxBasicResumes,
          maxBasicAIUsage: data.maxBasicAIUsage,
          maxBasicExports: data.maxBasicExports,
          maxProResumes: data.maxProResumes,
          maxProAIUsage: data.maxProAIUsage,
          maxProExports: data.maxProExports,
          basicPlanPrice: data.basicPlanPrice,
          proPlanPrice: data.proPlanPrice,
          maintenanceMode: data.maintenanceMode
        }
      })
    } else {
      // Create new settings
      return await prisma.systemSettings.create({
        data: {
          maxFreeResumes: data.maxFreeResumes,
          maxFreeAIUsage: data.maxFreeAIUsage,
          maxFreeExports: data.maxFreeExports,
          maxBasicResumes: data.maxBasicResumes,
          maxBasicAIUsage: data.maxBasicAIUsage,
          maxBasicExports: data.maxBasicExports,
          maxProResumes: data.maxProResumes,
          maxProAIUsage: data.maxProAIUsage,
          maxProExports: data.maxProExports,
          basicPlanPrice: data.basicPlanPrice,
          proPlanPrice: data.proPlanPrice,
          maintenanceMode: data.maintenanceMode
        }
      })
    }
  } catch (error) {
    console.error('Error updating system settings:', error)
    throw error
  }
}