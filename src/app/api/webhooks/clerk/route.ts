import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  console.log('🔍 Webhook received at:', new Date().toISOString())
  
  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  console.log('📋 Headers:', { svix_id, svix_timestamp, svix_signature })

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

  console.log('📦 Payload received:', JSON.stringify(payload, null, 2))
  console.log('🔑 Webhook secret exists:', !!process.env.CLERK_WEBHOOK_SECRET)

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
    console.log('✅ Webhook verification successful')
  } catch (err) {
    console.error('❌ Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400
    })
  }

  // Handle the webhook
  const eventType = evt.type
  console.log('🎯 Event type:', eventType)

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data
    console.log('👤 User data:', { id, email_addresses, first_name, last_name })

    const email = email_addresses[0]?.email_address
    if (!email) {
      console.error('❌ No email found in event data')
      return new Response('No email found', { status: 400 })
    }

    console.log('📧 Processing user:', { id, email, first_name, last_name })

    try {
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
      console.log('✅ User synced successfully:', user)

      // Create a free subscription for new users
      if (eventType === 'user.created') {
        const subscription = await prisma.subscription.create({
          data: {
            userId: id,
            plan: 'FREE',
            status: 'ACTIVE',
          },
        })
        console.log('✅ Subscription created:', subscription)
      }
    } catch (error) {
      console.error('❌ Error syncing user to database:', error)
      return new Response('Error syncing user', { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data
    console.log('🗑️ Deleting user:', id)

    try {
      await prisma.user.delete({
        where: { clerkId: id },
      })
      console.log('✅ User deleted successfully')
    } catch (error) {
      console.error('❌ Error deleting user from database:', error)
      return new Response('Error deleting user', { status: 500 })
    }
  }

  console.log('🎉 Webhook processed successfully')
  return new Response('', { status: 200 })
}