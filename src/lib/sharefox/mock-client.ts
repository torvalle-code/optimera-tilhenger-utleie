import { SharefoxBooking, SharefoxOrder, SharefoxInventoryItem, CreateBookingPayload, OrderFilters } from '../types';
import { DEMO_FLEET } from '../fleet/trailers';

function delay(ms: number = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let mockBookingCounter = 1000;

export class MockSharefoxClient {
  async lookupBarcode(barcode: string): Promise<SharefoxInventoryItem | null> {
    await delay();
    const trailer = DEMO_FLEET.find((t) => t.barcode === barcode);
    if (!trailer) return null;
    return {
      id: parseInt(trailer.sharefoxInventoryId.replace('sf-inv-', ''), 10) || 1,
      productId: parseInt(trailer.sharefoxProductId.replace('sf-prod-', ''), 10) || 1,
      barcode: trailer.barcode,
      status: trailer.status === 'available' ? 'available' : 'unavailable',
      name: trailer.name,
    };
  }

  async createBooking(payload: CreateBookingPayload): Promise<SharefoxBooking> {
    await delay(300);
    mockBookingCounter++;
    return {
      id: mockBookingCounter,
      bookingReference: `SF-MOCK-${mockBookingCounter}`,
      status: 'Booked',
      startDate: payload.startDate,
      endDate: payload.endDate,
      productId: payload.productId,
      inventoryItemId: payload.inventoryItemId,
    };
  }

  async updateBookingStatus(_bookingId: number, _status: string): Promise<void> {
    await delay();
  }

  async getOrder(bookingRef: string): Promise<SharefoxOrder> {
    await delay();
    return {
      id: parseInt(bookingRef.replace('SF-MOCK-', ''), 10) || 1,
      status: 'Booked',
      bookings: [],
      customer: { email: 'demo@test.no', firstName: 'Demo', lastName: 'Kunde', phone: '91234567' },
      totalPrice: 350,
      currency: 'NOK',
    };
  }

  async listOrders(_filters?: OrderFilters): Promise<SharefoxOrder[]> {
    await delay();
    return [];
  }

  async updateOrderStatus(_orderId: number, _status: string): Promise<void> {
    await delay();
  }

  async listCustomers(_query?: string): Promise<SharefoxOrder['customer'][]> {
    await delay();
    return [
      { email: 'ola@nordmann.no', firstName: 'Ola', lastName: 'Nordmann', phone: '91234567' },
      { email: 'kari@example.no', firstName: 'Kari', lastName: 'Hansen', phone: '98765432' },
    ];
  }
}
