import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { authMiddleware } from '@/middleware/auth';

const submissionSchema = z.object({
  content: z.string().min(1),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const submissions = await prisma.submission.findMany({
      where: { projectId: params.id },
      include: {
        user: {
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

    return NextResponse.json(submissions);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authResponse = await authMiddleware(request as any);
    if (authResponse.status !== 200) {
      return authResponse;
    }

    const body = await request.json();
    const { content } = submissionSchema.parse(body);

    const token = request.headers.get('authorization')?.split(' ')[1];
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET!);

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const submission = await prisma.submission.create({
      data: {
        content,
        userId: decoded.userId,
        projectId: params.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(submission, { status: 201 });
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