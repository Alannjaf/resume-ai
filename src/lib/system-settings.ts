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
          maxFreeImports: 0,
          maxBasicResumes: 50,
          maxBasicAIUsage: 500,
          maxBasicExports: 100,
          maxBasicImports: 0,
          maxProResumes: -1,
          maxProAIUsage: -1,
          maxProExports: -1,
          maxProImports: -1,
          freeTemplates: JSON.stringify(['modern']),
          basicTemplates: JSON.stringify(['modern', 'creative']),
          proTemplates: JSON.stringify(['modern', 'creative', 'executive']),
          photoUploadPlans: JSON.stringify(['BASIC', 'PRO']),
          basicPlanPrice: 5000,
          proPlanPrice: 10000,
          maintenanceMode: false
        }
      })
    }
    
    return settings
  } catch {
    // Error getting system settings
    // Return default settings on error
    return {
      id: 1,
      maxFreeResumes: 10,
      maxFreeAIUsage: 100,
      maxFreeExports: 20,
      maxFreeImports: 0,
      maxBasicResumes: 50,
      maxBasicAIUsage: 500,
      maxBasicExports: 100,
      maxBasicImports: 0,
      maxProResumes: -1,
      maxProAIUsage: -1,
      maxProExports: -1,
      maxProImports: -1,
      freeTemplates: JSON.stringify(['modern']),
      basicTemplates: JSON.stringify(['modern', 'creative']),
      proTemplates: JSON.stringify(['modern', 'creative', 'executive']),
      photoUploadPlans: JSON.stringify(['BASIC', 'PRO']),
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
          maxFreeImports: data.maxFreeImports,
          maxBasicResumes: data.maxBasicResumes,
          maxBasicAIUsage: data.maxBasicAIUsage,
          maxBasicExports: data.maxBasicExports,
          maxBasicImports: data.maxBasicImports,
          maxProResumes: data.maxProResumes,
          maxProAIUsage: data.maxProAIUsage,
          maxProExports: data.maxProExports,
          maxProImports: data.maxProImports,
          freeTemplates: JSON.stringify(data.freeTemplates),
          basicTemplates: JSON.stringify(data.basicTemplates),
          proTemplates: JSON.stringify(data.proTemplates),
          photoUploadPlans: JSON.stringify(data.photoUploadPlans),
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
          maxFreeImports: data.maxFreeImports,
          maxBasicResumes: data.maxBasicResumes,
          maxBasicAIUsage: data.maxBasicAIUsage,
          maxBasicExports: data.maxBasicExports,
          maxBasicImports: data.maxBasicImports,
          maxProResumes: data.maxProResumes,
          maxProAIUsage: data.maxProAIUsage,
          maxProExports: data.maxProExports,
          maxProImports: data.maxProImports,
          freeTemplates: JSON.stringify(data.freeTemplates),
          basicTemplates: JSON.stringify(data.basicTemplates),
          proTemplates: JSON.stringify(data.proTemplates),
          photoUploadPlans: JSON.stringify(data.photoUploadPlans),
          basicPlanPrice: data.basicPlanPrice,
          proPlanPrice: data.proPlanPrice,
          maintenanceMode: data.maintenanceMode
        }
      })
    }
  } catch (error) {
    // Error updating system settings
    throw error
  }
}