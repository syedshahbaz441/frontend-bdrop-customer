export type CustomerServiceType = 'food' | 'pickup' | 'drop';

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
