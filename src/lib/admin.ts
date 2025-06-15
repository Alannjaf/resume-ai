import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function isAdmin(): Promise<boolean> {
  try {
    const { userId } = await auth()
    if (!userId) return false

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true }
    })

    return user?.role === 'ADMIN'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

export async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Unauthorized: Admin access required')
  }
}