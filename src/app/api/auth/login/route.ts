import { NextResponse } from 'next/server';
import { validateCredentials } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Brukernavn og passord er påkrevd' }, { status: 400 });
    }

    const user = validateCredentials(username, password);
    if (!user) {
      return NextResponse.json({ error: 'Feil brukernavn eller passord' }, { status: 401 });
    }

    // Set session cookie (httpOnly, secure in production)
    const sessionData = JSON.stringify(user);
    const cookieStore = await cookies();
    cookieStore.set('session', Buffer.from(sessionData).toString('base64'), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json({ error: 'Serverfeil' }, { status: 500 });
  }
}
