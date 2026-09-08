export interface CustomerOrderRequest {
  service: string;
  pickupLocation: string;
  dropoffLocation: string;
  orderDate: string;
  pickupTime: string;
  totalAmount: number;
}

export interface CustomerOrderResponse {
  id: number;
  service: string;
  status: string;
  pickupLocation: string;
  dropoffLocation: string;
  orderDate: string;
  pickupTime: string;
  estimatedArrival: string;
  totalAmount: number;
  progress: number;
}

const API_BASE = '/api/customer';

export async function getCustomerOrders(): Promise<CustomerOrderResponse[]> {
  const response = await fetch(`${API_BASE}/orders`);
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
}

export async function getActiveCustomerOrder(): Promise<CustomerOrderResponse> {
  const response = await fetch(`${API_BASE}/orders/active`);
  if (!response.ok) throw new Error('Failed to fetch active order');
  return response.json();
}

export async function createCustomerOrder(payload: CustomerOrderRequest): Promise<CustomerOrderResponse> {
  const response = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error('Failed to create order');
  return response.json();
}
