// Run this script after signing in to create user in database
// Usage: npx tsx scripts/sync-dev-user.ts

import { createClerkClient } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!
})

const prisma = new PrismaClient()

async function syncDevUser() {
  try {
    // Get all users from Clerk
    const users = await clerkClient.users.getUserList()
    
    for (const user of users.data) {
      const email = user.emailAddresses[0]?.emailAddress
      
      if (!email) {
        // Skipping user without email
        continue
      }

      // Check if user exists in database by clerkId or email
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { clerkId: user.id },
            { email: email }
          ]
        }
      })

      if (!existingUser) {
        // Create user in database
        await prisma.user.create({
          data: {
            clerkId: user.id,
            email: email,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
            role: 'USER'
          }
        })
        // User created
      } else if (existingUser.clerkId !== user.id) {
        // Update existing user with clerkId if email matches but clerkId doesn't
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { clerkId: user.id }
        })
        // User updated with clerk ID
      } else {
        // User already exists
      }
    }
    
    // Sync complete
  } catch (error) {
    // Error syncing users
  } finally {
    await prisma.$disconnect()
  }
}

syncDevUser()