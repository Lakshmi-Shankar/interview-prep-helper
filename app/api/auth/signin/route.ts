import { NextResponse } from 'next/server';
import { signIn } from '@/services/auth.service';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const data = await signIn(email, password);

    return NextResponse.json(
      { 
        message: 'Login successful',
        user: data.user,
        session: data.session 
      },
      { status: 200 }
    );

  } catch (err: any) {
    console.error('Login error:', err);

    if (err.message?.includes('Invalid login credentials')) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: err.message || 'Login failed' },
      { status: 500 }
    );
  }
}