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
    
    console.log('Users in database:')
    users.forEach(user => {
      console.log(`- ${user.email} (${user.name})`)
      console.log(`  ClerkID: ${user.clerkId}`)
      console.log(`  Role: ${user.role}`)
      console.log(`  Resumes: ${user.resumes.length}`)
      console.log('---')
    })
  } catch (error) {
    console.error('Error checking users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser()