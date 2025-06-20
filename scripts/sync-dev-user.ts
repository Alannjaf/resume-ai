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
        console.log('Skipping user without email:', user.id)
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
        const newUser = await prisma.user.create({
          data: {
            clerkId: user.id,
            email: email,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
            role: 'USER'
          }
        })
        console.log('Created user:', newUser.email)
      } else if (existingUser.clerkId !== user.id) {
        // Update existing user with clerkId if email matches but clerkId doesn't
        const updatedUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: { clerkId: user.id }
        })
        console.log('Updated user with clerkId:', updatedUser.email)
      } else {
        console.log('User already exists:', existingUser.email)
      }
    }
    
    console.log('Sync complete!')
  } catch (error) {
    console.error('Error syncing users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

syncDevUser()