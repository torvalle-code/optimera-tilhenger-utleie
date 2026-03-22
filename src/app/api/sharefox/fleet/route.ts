import { NextResponse } from 'next/server';
import { getSharefoxClient } from '@/lib/sharefox';
import { DEMO_FLEET } from '@/lib/fleet/trailers';
import { getEnvConfig } from '@/lib/env';

export async function GET() {
  try {
    const env = getEnvConfig();
    if (env.sharefoxMock) {
      return NextResponse.json(DEMO_FLEET);
    }
    // In production: fetch from Sharefox inventory and map to Trailer[]
    const client = getSharefoxClient();
    // For now, return demo fleet until full Sharefox product mapping is implemented
    return NextResponse.json(DEMO_FLEET);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
