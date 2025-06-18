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
    profilePictureUrl?: string
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
        "maxBasicResumes",
        "maxBasicAIUsage",
        "maxBasicExports", 
        "maxProResumes",
        "maxProAIUsage",
        "maxProExports"
      FROM "SystemSettings" 
      ORDER BY id LIMIT 1
    `) as any[]

    if (settingsRecord && settingsRecord.length > 0) {
      return settingsRecord[0]
    }
  } catch (error) {
    // Table might not exist, use defaults
  }
  
  return {
    // Free Plan Limits
    maxFreeResumes: 10,
    maxFreeAIUsage: 100,
    maxFreeExports: 20,
    
    // Basic Plan Limits
    maxBasicResumes: 50,
    maxBasicAIUsage: 500,
    maxBasicExports: 100,
    
    // Pro Plan Limits
    maxProResumes: -1,
    maxProAIUsage: -1,
    maxProExports: -1
  }
}

export async function checkUserLimits(userId: string) {
  const subscription = await getUserSubscription(userId)
  
  if (!subscription) {
    return { canCreateResume: false, canUseAI: false, canExport: false }
  }

  // Get admin-configurable settings
  const systemSettings = await getSystemSettings()

  const limits = {
    FREE: { 
      resumes: systemSettings.maxFreeResumes || 10, 
      ai: systemSettings.maxFreeAIUsage || 100, 
      exports: systemSettings.maxFreeExports || 20 
    },
    BASIC: { 
      resumes: systemSettings.maxBasicResumes || 50, 
      ai: systemSettings.maxBasicAIUsage || 500, 
      exports: systemSettings.maxBasicExports || 100 
    },
    PRO: { 
      resumes: systemSettings.maxProResumes || -1, 
      ai: systemSettings.maxProAIUsage || -1, 
      exports: systemSettings.maxProExports || -1 
    }, // -1 means unlimited
  }

  const userLimits = limits[subscription.plan]

  return {
    canCreateResume: userLimits.resumes === -1 || subscription.resumeCount < userLimits.resumes,
    canUseAI: userLimits.ai === -1 || subscription.aiUsageCount < userLimits.ai,
    canExport: userLimits.exports === -1 || subscription.exportCount < userLimits.exports,
    subscription,
  }
}