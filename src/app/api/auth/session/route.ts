import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { AuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session?.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user: AuthUser = JSON.parse(
      Buffer.from(session.value, 'base64').toString('utf-8')
    );

    return NextResponse.json({ authenticated: true, user });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
