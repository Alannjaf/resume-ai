import { auth } from '@clerk/nextjs/server'
import { prisma } from './prisma'

export async function getCurrentUser() {
  const { userId } = await auth()
  
  if (!userId) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      subscription: true,
    },
  })

  return user
}

export async function getUserResumes(userId: string) {
  const resumes = await prisma.resume.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: {
      sections: {
        orderBy: { order: 'asc' },
      },
    },
  })

  return resumes
}

export async function getResumeById(resumeId: string, userId: string) {
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId,
    },
    include: {
      sections: {
        orderBy: { order: 'asc' },
      },
    },
  })

  return resume
}

export async function createResume(userId: string, title: string, template?: string) {
  const resume = await prisma.resume.create({
    data: {
      userId,
      title,
      template: template || 'modern',
      sections: {
        create: [
          {
            type: 'WORK_EXPERIENCE',
            title: 'Work Experience',
            content: {},
            order: 1,
          },
          {
            type: 'EDUCATION',
            title: 'Education',
            content: {},
            order: 2,
          },
          {
            type: 'SKILLS',
            title: 'Skills',
            content: {},
            order: 3,
          },
        ],
      },
    },
    include: {
      sections: true,
    },
  })

  // Update user's resume count
  await prisma.subscription.update({
    where: { userId },
    data: { resumeCount: { increment: 1 } },
  })

  return resume
}

export async function deleteResume(resumeId: string, userId: string) {
  const resume = await prisma.resume.deleteMany({
    where: {
      id: resumeId,
      userId,
    },
  })

  // Update user's resume count
  await prisma.subscription.update({
    where: { userId },
    data: { resumeCount: { decrement: 1 } },
  })

  return resume
}

export async function updateResume(
  resumeId: string,
  userId: string,
  data: {
    title?: string
    personalInfo?: any
    summary?: string
    template?: string
  }
) {
  const resume = await prisma.resume.update({
    where: {
      id: resumeId,
      userId,
    },
    data,
  })

  return resume
}

export async function getUserSubscription(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  return subscription
}

async function getSystemSettings() {
  try {
    const settingsRecord = await prisma.$queryRawUnsafe(`
      SELECT 
        "maxFreeResumes",
        "maxFreeAIUsage", 
        "maxFreeExports",
        "maxFreeImports",
        "maxBasicResumes",
        "maxBasicAIUsage",
        "maxBasicExports",
        "maxBasicImports",
        "maxProResumes",
        "maxProAIUsage",
        "maxProExports",
        "maxProImports",
        "freeTemplates",
        "basicTemplates",
        "proTemplates",
        "photoUploadPlans"
      FROM "SystemSettings" 
      ORDER BY id LIMIT 1
    `) as any[]

    if (settingsRecord && settingsRecord.length > 0) {
      const settings = settingsRecord[0]
      // Parse JSON fields
      if (settings.freeTemplates && typeof settings.freeTemplates === 'string') {
        settings.freeTemplates = JSON.parse(settings.freeTemplates)
      }
      if (settings.basicTemplates && typeof settings.basicTemplates === 'string') {
        settings.basicTemplates = JSON.parse(settings.basicTemplates)
      }
      if (settings.proTemplates && typeof settings.proTemplates === 'string') {
        settings.proTemplates = JSON.parse(settings.proTemplates)
      }
      if (settings.photoUploadPlans && typeof settings.photoUploadPlans === 'string') {
        settings.photoUploadPlans = JSON.parse(settings.photoUploadPlans)
      }
      return settings
    }
  } catch (error) {
    // Table might not exist, use defaults
  }
  
  return {
    // Free Plan Limits - Restrictive defaults to encourage upgrades
    maxFreeResumes: 1,
    maxFreeAIUsage: 10,
    maxFreeExports: 0,
    maxFreeImports: 0,
    
    // Basic Plan Limits
    maxBasicResumes: 5,
    maxBasicAIUsage: 100,
    maxBasicExports: 10,
    maxBasicImports: 0,
    
    // Pro Plan Limits
    maxProResumes: -1,
    maxProAIUsage: -1,
    maxProExports: -1,
    maxProImports: -1,
    
    // Template Access Control
    freeTemplates: ['modern'],
    basicTemplates: ['modern', 'creative'],
    proTemplates: ['modern', 'creative', 'executive'],
    
    // Profile Photo Upload Access Control
    photoUploadPlans: ['BASIC', 'PRO']
  }
}

export async function checkUserLimits(clerkUserId: string) {
  // First get the database user from Clerk ID
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    include: { subscription: true }
  })
  
  if (!user || !user.subscription) {
    return { canCreateResume: false, canUseAI: false, canExport: false, canImport: false }
  }
  
  const subscription = user.subscription

  // Get admin-configurable settings
  const systemSettings = await getSystemSettings()

  const limits = {
    FREE: { 
      resumes: systemSettings.maxFreeResumes ?? 10, 
      ai: systemSettings.maxFreeAIUsage ?? 100, 
      exports: systemSettings.maxFreeExports ?? 0,
      imports: systemSettings.maxFreeImports ?? 0
    },
    BASIC: { 
      resumes: systemSettings.maxBasicResumes ?? 50, 
      ai: systemSettings.maxBasicAIUsage ?? 500, 
      exports: systemSettings.maxBasicExports ?? 100,
      imports: systemSettings.maxBasicImports ?? 0
    },
    PRO: { 
      resumes: systemSettings.maxProResumes ?? -1, 
      ai: systemSettings.maxProAIUsage ?? -1, 
      exports: systemSettings.maxProExports ?? -1,
      imports: systemSettings.maxProImports ?? -1
    }, // -1 means unlimited
  }

  const userLimits = limits[subscription.plan]


  // Check photo upload permission
  const canUploadPhoto = systemSettings.photoUploadPlans.includes(subscription.plan)
  
  // Get available templates for user's plan
  let availableTemplates: string[] = []
  switch (subscription.plan) {
    case 'FREE':
      availableTemplates = systemSettings.freeTemplates || ['modern']
      break
    case 'BASIC':
      availableTemplates = systemSettings.basicTemplates || ['modern', 'creative']
      break
    case 'PRO':
      availableTemplates = systemSettings.proTemplates || ['modern', 'creative', 'executive']
      break
  }

  return {
    canCreateResume: userLimits.resumes === -1 || subscription.resumeCount < userLimits.resumes,
    canUseAI: userLimits.ai === -1 || subscription.aiUsageCount < userLimits.ai,
    canExport: userLimits.exports === -1 || (subscription.exportCount || 0) < userLimits.exports,
    canImport: userLimits.imports === -1 || (subscription.importCount || 0) < userLimits.imports,
    canUploadPhoto,
    availableTemplates,
    subscription,
  }
}