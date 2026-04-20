import { NextResponse } from 'next/server';
import { signUp } from '@/services/auth.service';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const data = await signUp(email, password, name);

    return NextResponse.json(
      { 
        message: 'Signup successful!',
        user: data.user 
      },
      { status: 201 }
    );

  } catch (err: any) {
    console.error('Signup error:', err);
    
    if (err.message?.includes('already registered')) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: err.message || 'Signup failed' },
      { status: 500 }
    );
  }
}