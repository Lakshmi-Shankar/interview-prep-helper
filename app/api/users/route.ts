import { NextResponse } from 'next/server';
import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser
} from '@/services/user.service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get('id');
    const mail = searchParams.get('mail');

    if (id) {
      const user = await getUserById(id);
      return NextResponse.json(user);
    }

    if (mail) {
      const user = await getUserByEmail(mail);
      return NextResponse.json(user);
    }

    // default: get all users
    const users = await getAllUsers();
    return NextResponse.json(users);

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user = await createUser(
      body.name,
      body.mail,
      body.password
    );

    return NextResponse.json(user, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}