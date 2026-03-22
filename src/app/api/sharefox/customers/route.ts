import { NextResponse } from 'next/server';
import { getSharefoxClient } from '@/lib/sharefox';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';
    const client = getSharefoxClient();
    const customers = await client.listCustomers(query);
    return NextResponse.json(customers);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
