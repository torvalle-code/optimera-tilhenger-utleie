import { NextResponse } from 'next/server';
import { getSharefoxClient } from '@/lib/sharefox';
import { getEnvConfig } from '@/lib/env';
import { rentalToSharefoxBooking } from '@/lib/sharefox/mappers';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || undefined;
    const env = getEnvConfig();

    if (env.sharefoxMock) {
      // Return empty list in mock mode (no persistent state yet)
      return NextResponse.json([]);
    }

    const client = getSharefoxClient();
    const orders = await client.listOrders({ status });
    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const env = getEnvConfig();

    if (env.sharefoxMock) {
      const client = getSharefoxClient();
      const booking = await client.createBooking(rentalToSharefoxBooking(body));
      return NextResponse.json({
        sharefoxOrderId: String(booking.id),
        sharefoxBookingRef: booking.bookingReference,
      });
    }

    const client = getSharefoxClient();
    const bookingPayload = rentalToSharefoxBooking(body);
    const booking = await client.createBooking(bookingPayload);
    // Update status to Booked
    await client.updateBookingStatus(booking.id, 'Booked');

    return NextResponse.json({
      sharefoxOrderId: String(booking.id),
      sharefoxBookingRef: booking.bookingReference,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
