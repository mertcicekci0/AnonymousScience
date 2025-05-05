import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { authMiddleware } from '@/middleware/auth';

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string().min(1),
});

export async function GET(request: Request) {
  try {
    const projects = await prisma.project.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authResponse = await authMiddleware(request as any);
    if (authResponse.status !== 200) {
      return authResponse;
    }

    const body = await request.json();
    const { title, description, content } = projectSchema.parse(body);

    const token = request.headers.get('authorization')?.split(' ')[1];
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET!);

    const project = await prisma.project.create({
      data: {
        title,
        description,
        content,
        authorId: decoded.userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 