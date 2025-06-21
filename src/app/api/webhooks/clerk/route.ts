import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  console.log('🚀 Webhook received')
  
  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  console.log('📋 Headers:', { svix_id, svix_timestamp, svix_signature: svix_signature ? 'present' : 'missing' })

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('❌ Missing svix headers')
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)
  console.log('📦 Payload received:', payload.type)

  // Check environment variables
  if (!process.env.CLERK_WEBHOOK_SECRET) {
    console.error('❌ Missing CLERK_WEBHOOK_SECRET')
    return new Response('Server configuration error', { status: 500 })
  }

  console.log('🔑 Webhook secret present:', process.env.CLERK_WEBHOOK_SECRET.substring(0, 10) + '...')

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
    console.log('✅ Webhook signature verified')
  } catch (err) {
    console.error('❌ Webhook verification failed:', err)
    return new Response('Error occured', {
      status: 400
    })
  }

  // Handle the webhook
  const eventType = evt.type
  console.log(`🎯 Processing event: ${eventType}`)

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data
    console.log(`👤 User data: ${id}, ${first_name} ${last_name}`)

    const email = email_addresses[0]?.email_address
    if (!email) {
      console.error('❌ No email found in payload')
      return new Response('No email found', { status: 400 })
    }

    console.log(`📧 Email: ${email}`)

    try {
      console.log('💾 Starting database operations...')
      
      const user = await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          email,
          name: `${first_name || ''} ${last_name || ''}`.trim() || null,
        },
        create: {
          clerkId: id,
          email,
          name: `${first_name || ''} ${last_name || ''}`.trim() || null,
        },
      })

      console.log(`✅ User upserted: ${user.id}`)

      // Create a free subscription for new users
      if (eventType === 'user.created') {
        console.log('🆕 Creating subscription for new user...')
        
        // Check if subscription already exists
        const existingSubscription = await prisma.subscription.findUnique({
          where: { userId: user.id }
        })

        if (!existingSubscription) {
          const subscription = await prisma.subscription.create({
            data: {
              userId: user.id, // Use database user ID, not Clerk ID
              plan: 'FREE',
              status: 'ACTIVE',
            },
          })
          console.log(`✅ Subscription created: ${subscription.id}`)
        } else {
          console.log('⚠️ Subscription already exists')
        }
      }
      
      console.log('🎉 User sync completed successfully')
    } catch (error) {
      console.error('❌ Database error:', error)
      return new Response(`Error syncing user: ${error}`, { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data
    console.log(`🗑️ Deleting user: ${id}`)

    try {
      // Check if user exists first
      const user = await prisma.user.findUnique({
        where: { clerkId: id }
      })

      if (user) {
        // Delete user (this will cascade delete resumes, subscriptions, etc.)
        await prisma.user.delete({
          where: { clerkId: id },
        })
        console.log(`✅ User deleted: ${id}`)
      } else {
        console.log(`⚠️ User not found for deletion: ${id}`)
      }
    } catch (error) {
      console.error('❌ Error deleting user:', error)
      return new Response(`Error deleting user: ${error}`, { status: 500 })
    }
  }

  console.log('🎉 Webhook processed successfully')
  return new Response('OK', { status: 200 })
}