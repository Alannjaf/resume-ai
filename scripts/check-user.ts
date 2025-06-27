// Quick script to check user in database
// Usage: npx tsx scripts/check-user.ts

import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function checkUser() {
  try {
    const users = await prisma.user.findMany({
      include: {
        resumes: true,
        subscription: true
      }
    })
    
    // Users in database (remove output for production)
    users.forEach(user => {
      // User info
      // Clerk ID
      // User role
      // Resume count
      // Separator
    })
  } catch (error) {
    // Error checking users
  } finally {
    await prisma.$disconnect()
  }
}

checkUser()