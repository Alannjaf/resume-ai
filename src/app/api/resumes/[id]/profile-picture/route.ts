import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the current user and check subscription
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('Profile picture upload - user subscription:', { subscription: user.subscription }) // Debug log
    if (!user.subscription || user.subscription.plan !== 'PRO') {
      return NextResponse.json({ 
        error: 'Profile pictures are only available for Pro subscribers' 
      }, { status: 403 })
    }

    // Verify resume ownership
    const resume = await prisma.resume.findFirst({
      where: { id: params.id, userId: user.id }
    })

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: 'Invalid file type. Please upload JPG, PNG, GIF, or WebP images only.'
      }, { status: 400 })
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      return NextResponse.json({
        error: 'File too large. Maximum size is 2MB.'
      }, { status: 400 })
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    // Update resume with profile picture
    const updatedResume = await prisma.resume.update({
      where: { id: params.id, userId: user.id },
      data: { profilePictureUrl: dataUrl }
    })

    return NextResponse.json({
      success: true,
      profilePictureUrl: dataUrl
    })

  } catch (error) {
    console.error('Profile picture upload error:', error)
    return NextResponse.json({
      error: 'Failed to upload profile picture. Please try again.'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify resume ownership
    const resume = await prisma.resume.findFirst({
      where: { id: params.id, userId: user.id }
    })

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    // Remove profile picture
    await prisma.resume.update({
      where: { id: params.id, userId: user.id },
      data: { profilePictureUrl: null }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Profile picture deletion error:', error)
    return NextResponse.json({
      error: 'Failed to remove profile picture. Please try again.'
    }, { status: 500 })
  }
}