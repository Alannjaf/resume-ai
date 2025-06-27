import { prisma } from '@/lib/prisma'

async function addUserRoles() {
  try {
    // Adding role column to users table
    
    // Add the role column with default value
    await prisma.$executeRaw`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'USER'
    `
    
    // Role column added successfully
    
    // Make alann.jaf@gmail.com an admin
    // Setting admin role for alann.jaf@gmail.com
    
    const adminUser = await prisma.user.update({
      where: { email: 'alann.jaf@gmail.com' },
      data: { role: 'ADMIN' as const }
    })
    
    // Admin role set
    
    // Get statistics
    const userCount = await prisma.user.count()
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' }
    })
    
    // Total users counted
    // Total admins counted
    
  } catch (error) {
    // Error occurred
  } finally {
    await prisma.$disconnect()
  }
}

addUserRoles()