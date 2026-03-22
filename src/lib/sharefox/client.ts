import { SharefoxBooking, SharefoxOrder, SharefoxInventoryItem, CreateBookingPayload, OrderFilters } from '../types';

export class SharefoxApiError extends Error {
  constructor(
    public statusCode: number,
    public sharefoxError: string,
    public sharefoxMessage: string
  ) {
    super(`Sharefox API ${statusCode}: ${sharefoxMessage}`);
    this.name = 'SharefoxApiError';
  }
}

interface SharefoxClientConfig {
  baseUrl: string;
  adminEmail: string;
  adminPassword: string;
  domain: string;
}

export class SharefoxClient {
  private token: string | null = null;
  private tokenExpiry: number = 0;
  private config: SharefoxClientConfig;

  constructor(config: SharefoxClientConfig) {
    this.config = config;
  }

  private async ensureToken(): Promise<string> {
    if (this.token && Date.now() < this.tokenExpiry - 60000) {
      return this.token;
    }

    const res = await fetch(`${this.config.baseUrl}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-sharefox-admin-domain': this.config.domain,
      },
      body: JSON.stringify({
        email: this.config.adminEmail,
        password: this.config.adminPassword,
      }),
    });

    if (!res.ok) {
      throw new SharefoxApiError(res.status, 'auth_failed', 'Failed to authenticate with Sharefox');
    }

    const data = await res.json();
    this.token = data.token;
    // Assume 1 hour token lifetime if not specified
    this.tokenExpiry = Date.now() + 3600000;
    return this.token!;
  }

  private async request<T>(method: string, path: string, body?: unknown, retry = true): Promise<T> {
    const token = await this.ensureToken();

    const res = await fetch(`${this.config.baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-sharefox-admin-domain': this.config.domain,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401 && retry) {
      this.token = null;
      return this.request<T>(method, path, body, false);
    }

    if (!res.ok) {
      let errorBody = { error: 'unknown', message: `HTTP ${res.status}` };
      try { errorBody = await res.json(); } catch {}
      throw new SharefoxApiError(res.status, errorBody.error, errorBody.message);
    }

    return res.json();
  }

  // Inventory
  async lookupBarcode(barcode: string): Promise<SharefoxInventoryItem | null> {
    try {
      return await this.request<SharefoxInventoryItem>('GET', `/admin/inventory/barcode/${encodeURIComponent(barcode)}`);
    } catch (err) {
      if (err instanceof SharefoxApiError && err.statusCode === 404) return null;
      throw err;
    }
  }

  // Bookings
  async createBooking(payload: CreateBookingPayload): Promise<SharefoxBooking> {
    return this.request<SharefoxBooking>('POST', '/bookings/', payload);
  }

  async updateBookingStatus(bookingId: number, status: string): Promise<void> {
    await this.request('PUT', `/admin/bookings/${bookingId}/status`, { status });
  }

  // Orders
  async getOrder(bookingRef: string): Promise<SharefoxOrder> {
    return this.request<SharefoxOrder>('GET', `/orders/${encodeURIComponent(bookingRef)}`);
  }

  async listOrders(filters?: OrderFilters): Promise<SharefoxOrder[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.from) params.set('from', filters.from);
    if (filters?.to) params.set('to', filters.to);
    if (filters?.page) params.set('page', String(filters.page));
    if (filters?.limit) params.set('limit', String(filters.limit));
    const qs = params.toString();
    return this.request<SharefoxOrder[]>('GET', `/admin/orders/${qs ? `?${qs}` : ''}`);
  }

  async updateOrderStatus(orderId: number, status: string): Promise<void> {
    await this.request('PUT', `/admin/orders/${orderId}/status`, { status });
  }

  // Customers
  async listCustomers(query?: string): Promise<SharefoxOrder['customer'][]> {
    const params = query ? `?q=${encodeURIComponent(query)}` : '';
    return this.request<SharefoxOrder['customer'][]>('GET', `/admin/customers/${params}`);
  }
}
