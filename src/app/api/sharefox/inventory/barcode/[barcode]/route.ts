import { NextResponse } from 'next/server';
import { getSharefoxClient } from '@/lib/sharefox';
import { findTrailerByBarcode } from '@/lib/fleet/trailers';
import { getEnvConfig } from '@/lib/env';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ barcode: string }> }
) {
  try {
    const { barcode } = await params;
    const env = getEnvConfig();

    if (env.sharefoxMock) {
      const trailer = findTrailerByBarcode(barcode);
      if (!trailer) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      return NextResponse.json(trailer);
    }

    const client = getSharefoxClient();
    const item = await client.lookupBarcode(barcode);
    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    // Map SharefoxInventoryItem to Trailer
    const trailer = findTrailerByBarcode(barcode); // Enrich with local data
    return NextResponse.json(trailer || item);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
