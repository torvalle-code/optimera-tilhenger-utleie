import { NextResponse } from 'next/server';
import { getSharefoxClient } from '@/lib/sharefox';
import { getEnvConfig } from '@/lib/env';

export async function POST(request: Request) {
  try {
    const { rentalId, sharefoxOrderId, damage } = await request.json();
    const env = getEnvConfig();

    if (env.sharefoxMock) {
      // Mock: just acknowledge
      return NextResponse.json({ success: true, rentalId });
    }

    const client = getSharefoxClient();
    const orderId = parseInt(sharefoxOrderId, 10);
    if (orderId) {
      await client.updateOrderStatus(orderId, 'Completed');
    }

    return NextResponse.json({ success: true, rentalId });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
