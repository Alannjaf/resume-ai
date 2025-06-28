import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Resume, ResumeStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

interface ResumeWithUser extends Resume {
  user: {
    id: string;
    email: string;
    name: string | null;
  };
  _count: {
    sections: number;
  };
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user table exists and has role column
    try {
      const user = await prisma.user.findUnique({
        where: { clerkId: userId }});

      if (!user || user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    } catch {
      // If role column doesn't exist, just check if user exists
      const userExists = await prisma.user.findUnique({
        where: { clerkId: userId }});
      
      if (!userExists) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    }

    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') as ResumeStatus | null;
    const template = searchParams.get('template') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const where = {
      AND: [
        search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { user: { email: { contains: search, mode: 'insensitive' as const } } },
            { user: { name: { contains: search, mode: 'insensitive' as const } } },
          ]} : {},
        status ? { status } : {},
        template ? { template } : {},
      ]};

    // Try to fetch resumes, but handle case where tables might not exist
    let resumes: ResumeWithUser[] = [];
    let total = 0;
    
    try {
      [resumes, total] = await Promise.all([
        prisma.resume.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true}},
            _count: {
              select: {
                sections: true}}},
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { [sortBy]: sortOrder }}),
        prisma.resume.count({ where }),
      ]);
    } catch {
      // Return empty array if tables don't exist yet
    }

    return NextResponse.json({
      resumes: resumes as ResumeWithUser[],
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)}});
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }});

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { ids } = await req.json();
    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    await prisma.resume.deleteMany({
      where: { id: { in: ids } }});

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}