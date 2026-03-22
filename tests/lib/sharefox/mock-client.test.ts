import { MockSharefoxClient } from '@/lib/sharefox/mock-client';

describe('MockSharefoxClient', () => {
  const client = new MockSharefoxClient();

  it('lookupBarcode finds TH-SKI-001', async () => {
    const result = await client.lookupBarcode('TH-SKI-001');
    expect(result).not.toBeNull();
    expect(result!.barcode).toBe('TH-SKI-001');
  });

  it('lookupBarcode returns null for unknown', async () => {
    const result = await client.lookupBarcode('NONEXISTENT');
    expect(result).toBeNull();
  });

  it('createBooking returns booking with reference', async () => {
    const result = await client.createBooking({
      productId: 1,
      startDate: '2026-03-22',
      endDate: '2026-03-23',
      customerEmail: 'test@test.no',
      customerFirstName: 'Test',
      customerLastName: 'User',
      customerPhone: '12345678',
    });
    expect(result.id).toBeGreaterThan(0);
    expect(result.bookingReference).toMatch(/^SF-MOCK-/);
  });

  it('listCustomers returns demo customers', async () => {
    const result = await client.listCustomers();
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result[0]).toHaveProperty('email');
    expect(result[0]).toHaveProperty('firstName');
  });
});
