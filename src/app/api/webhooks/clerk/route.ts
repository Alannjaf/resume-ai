import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

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
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400
    })
  }

  // Handle the webhook
  const eventType = evt.type
  console.log('Webhook event type:', eventType)

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data
    console.log('Processing user event:', { id, email_addresses, first_name, last_name })

    const email = email_addresses[0]?.email_address
    if (!email) {
      console.error('No email found in webhook payload')
      return new Response('No email found', { status: 400 })
    }

    try {
      console.log('Attempting to upsert user:', { clerkId: id, email })
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
      console.log('User upserted successfully:', user)

      // Create a free subscription for new users
      if (eventType === 'user.created') {
        console.log('Creating subscription for new user')
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
          console.log('Subscription created:', subscription)
        } else {
          console.log('Subscription already exists')
        }
      }
    } catch (error) {
      console.error('Error syncing user to database:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return new Response('Error syncing user', { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    try {
      await prisma.user.delete({
        where: { clerkId: id },
      })
    } catch (error) {
      console.error('Error deleting user from database:', error)
      return new Response('Error deleting user', { status: 500 })
    }
  }

  return new Response('', { status: 200 })
}