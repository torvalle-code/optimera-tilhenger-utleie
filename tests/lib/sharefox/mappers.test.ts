import { sharefoxStatusToRentalStatus, sharefoxInventoryToTrailer, rentalToSharefoxBooking } from '@/lib/sharefox/mappers';

describe('sharefoxStatusToRentalStatus', () => {
  it('maps Request -> pending', () => {
    expect(sharefoxStatusToRentalStatus('Request')).toBe('pending');
  });

  it('maps Booked -> active', () => {
    expect(sharefoxStatusToRentalStatus('Booked')).toBe('active');
  });

  it('maps Pending Completion -> returned', () => {
    expect(sharefoxStatusToRentalStatus('Pending Completion')).toBe('returned');
  });

  it('maps Completed -> completed', () => {
    expect(sharefoxStatusToRentalStatus('Completed')).toBe('completed');
  });

  it('maps Cancelled -> cancelled', () => {
    expect(sharefoxStatusToRentalStatus('Cancelled')).toBe('cancelled');
  });

  it('defaults unknown to pending', () => {
    expect(sharefoxStatusToRentalStatus('RandomStatus')).toBe('pending');
  });
});

describe('sharefoxInventoryToTrailer', () => {
  it('maps barcode and name', () => {
    const result = sharefoxInventoryToTrailer({
      id: 1, productId: 10, barcode: 'TH-001', status: 'available', name: 'Test Trailer',
    });
    expect(result.barcode).toBe('TH-001');
    expect(result.name).toBe('Test Trailer');
  });
});

describe('rentalToSharefoxBooking', () => {
  it('formats customer name correctly', () => {
    const result = rentalToSharefoxBooking({
      trailer: { sharefoxProductId: '5', sharefoxInventoryId: '10' } as any,
      customer: { name: 'Ola Nordmann', phone: '12345678', email: 'test@test.no' } as any,
      pickupTime: '2026-03-22T08:00:00Z',
      returnTime: '2026-03-23T16:00:00Z',
    });
    expect(result.customerFirstName).toBe('Ola');
    expect(result.customerLastName).toBe('Nordmann');
    expect(result.productId).toBe(5);
  });
});
