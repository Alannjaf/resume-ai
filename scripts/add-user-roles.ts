import { prisma } from '@/lib/prisma'

async function addUserRoles() {
  try {
    console.log('🔄 Adding role column to users table...')
    
    // Add the role column with default value
    await prisma.$executeRaw`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'USER'
    `
    
    console.log('✅ Role column added successfully')
    
    // Make alann.jaf@gmail.com an admin
    console.log('👑 Setting admin role for alann.jaf@gmail.com...')
    
    const adminUser = await prisma.user.update({
      where: { email: 'alann.jaf@gmail.com' },
      data: { role: 'ADMIN' as const }
    })
    
    console.log('✅ Admin role set for:', adminUser.email)
    
    // Get statistics
    const userCount = await prisma.user.count()
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' }
    })
    
    console.log(`📊 Total users: ${userCount}`)
    console.log(`👑 Total admins: ${adminCount}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addUserRoles()