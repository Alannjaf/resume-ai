import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function isAdmin(): Promise<boolean> {
  try {
    const { userId } = await auth()
    if (!userId) return false

    try {
      const user = await prisma.$queryRaw`
        SELECT "role" FROM "User" 
        WHERE "clerkId" = ${userId}
        LIMIT 1
      ` as any[]

      return user?.[0]?.role === 'ADMIN'
    } catch (e) {
      // Role column might not exist yet
      return false
    }
  } catch (error) {
    // Error checking admin status
    return false
  }
}

export async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Unauthorized: Admin access required')
  }
}