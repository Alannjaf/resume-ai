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

  // Check environment variables
  if (!process.env.CLERK_WEBHOOK_SECRET) {
    return new Response('Server configuration error', { status: 500 })
  }

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
    return new Response('Error occured', {
      status: 400
    })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data

    const email = email_addresses[0]?.email_address
    if (!email) {
      return new Response('No email found', { status: 400 })
    }

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

      // Create a free subscription for new users
      if (eventType === 'user.created') {
        // Check if subscription already exists
        const existingSubscription = await prisma.subscription.findUnique({
          where: { userId: user.id }
        })

        if (!existingSubscription) {
          await prisma.subscription.create({
            data: {
              userId: user.id, // Use database user ID, not Clerk ID
              plan: 'FREE',
              status: 'ACTIVE',
            },
          })
        }
      }
    } catch (error) {
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
      return new Response('Error deleting user', { status: 500 })
    }
  }

  return new Response('', { status: 200 })
}