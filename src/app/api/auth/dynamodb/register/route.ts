import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createUser } from '@/models/user';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
  walletAddress: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, walletAddress } = registerSchema.parse(body);

    try {
      const user = await createUser({
        email,
        password,
        name,
        walletAddress,
      });

      return NextResponse.json(
        {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            walletAddress: user.walletAddress,
          },
        },
        { status: 201 }
      );
    } catch (error: any) {
      // Check if it's a ConditionalCheckFailedException (user already exists)
      if (error.name === 'ConditionalCheckFailedException') {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 400 }
        );
      }
      
      throw error;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 