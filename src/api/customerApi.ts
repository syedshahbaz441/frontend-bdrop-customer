export interface LoginRequest {
  email: string;
  password: string;
  location?: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface Restaurant {
  id: number;
  name: string;
  location: string;
  categories: string[];
  deliveryFee: number;
  eta: string;
}

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

const API_BASE = '/api';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('buddydrop-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function loginCustomer(payload: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Unable to sign in. Please check your credentials.');
  }

  return response.json();
}

export async function getRestaurants(location: string): Promise<Restaurant[]> {
  const response = await fetch(`${API_BASE}/restaurants?location=${encodeURIComponent(location)}`);
  if (!response.ok) throw new Error('Failed to fetch restaurants');
  return response.json();
}

export async function getCustomerOrders(): Promise<CustomerOrderResponse[]> {
  const response = await fetch(`${API_BASE}/customer/orders`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
}

export async function getActiveCustomerOrder(): Promise<CustomerOrderResponse> {
  const response = await fetch(`${API_BASE}/customer/orders/active`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch active order');
  return response.json();
}

export async function createCustomerOrder(payload: CustomerOrderRequest): Promise<CustomerOrderResponse> {
  const response = await fetch(`${API_BASE}/customer/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error('Failed to create order');
  return response.json();
}
