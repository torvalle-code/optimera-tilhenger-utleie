import { NextResponse } from 'next/server';
import { getSharefoxClient } from '@/lib/sharefox';
import { getEnvConfig } from '@/lib/env';
import { rentalToSharefoxBooking } from '@/lib/sharefox/mappers';
import { QueueItem } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const queueItem: QueueItem = await request.json();
    const client = getSharefoxClient();
    const env = getEnvConfig();

    switch (queueItem.action) {
      case 'create_rental': {
        const bookingPayload = rentalToSharefoxBooking(queueItem.payload as any);
        const booking = await client.createBooking(bookingPayload);
        if (!env.sharefoxMock) {
          await client.updateBookingStatus(booking.id, 'Booked');
        }
        return NextResponse.json({
          success: true,
          sharefoxId: String(booking.id),
          bookingRef: booking.bookingReference,
        });
      }

      case 'confirm_return': {
        const { sharefoxOrderId } = queueItem.payload;
        if (sharefoxOrderId && typeof sharefoxOrderId === 'string') {
          const orderId = parseInt(sharefoxOrderId, 10);
          if (orderId) {
            await client.updateOrderStatus(orderId, 'Completed');
          }
        }
        return NextResponse.json({ success: true });
      }

      case 'confirm_pickup': {
        // Update booking status to active/booked
        return NextResponse.json({ success: true });
      }

      case 'update_status': {
        const { sharefoxOrderId: oid, status } = queueItem.payload;
        if (oid && status && typeof oid === 'string' && typeof status === 'string') {
          await client.updateOrderStatus(parseInt(oid, 10), status);
        }
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${queueItem.action}` }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
