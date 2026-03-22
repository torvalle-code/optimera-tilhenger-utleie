import { Trailer, Rental, RentalStatus, SharefoxInventoryItem, SharefoxProduct, SharefoxOrder, CreateBookingPayload } from '../types';

export function sharefoxInventoryToTrailer(
  item: SharefoxInventoryItem,
  product?: SharefoxProduct
): Partial<Trailer> {
  return {
    barcode: item.barcode,
    name: item.name || product?.name || 'Ukjent tilhenger',
    sharefoxProductId: String(item.productId),
    sharefoxInventoryId: String(item.id),
    status: item.status === 'available' ? 'available' : 'rented',
  };
}

export function sharefoxStatusToRentalStatus(sfStatus: string): RentalStatus {
  const map: Record<string, RentalStatus> = {
    'Request': 'pending',
    'Booked': 'active',
    'Pending Completion': 'returned',
    'Completed': 'completed',
    'Cancelled': 'cancelled',
  };
  return map[sfStatus] || 'pending';
}

export function sharefoxOrderToRental(order: SharefoxOrder, trailer: Trailer): Partial<Rental> {
  const booking = order.bookings[0];
  return {
    sharefoxOrderId: String(order.id),
    sharefoxBookingRef: booking?.bookingReference || '',
    trailer,
    customer: {
      id: `sf-cust-${order.id}`,
      type: 'guest',
      name: `${order.customer.firstName} ${order.customer.lastName}`,
      phone: order.customer.phone,
      email: order.customer.email,
      driversLicense: true,
      idVerified: false,
    },
    status: sharefoxStatusToRentalStatus(order.status),
    pickupTime: booking?.startDate || '',
    returnTime: booking?.endDate || '',
    totalPrice: order.totalPrice,
  };
}

export function rentalToSharefoxBooking(rental: Partial<Rental>): CreateBookingPayload {
  const nameParts = (rental.customer?.name || 'Ukjent').split(' ');
  return {
    productId: parseInt(rental.trailer?.sharefoxProductId || '0', 10),
    startDate: rental.pickupTime || new Date().toISOString(),
    endDate: rental.returnTime || new Date().toISOString(),
    customerEmail: rental.customer?.email || `${rental.customer?.phone}@placeholder.no`,
    customerFirstName: nameParts[0] || 'Ukjent',
    customerLastName: nameParts.slice(1).join(' ') || '',
    customerPhone: rental.customer?.phone || '',
    inventoryItemId: parseInt(rental.trailer?.sharefoxInventoryId || '0', 10) || undefined,
  };
}
