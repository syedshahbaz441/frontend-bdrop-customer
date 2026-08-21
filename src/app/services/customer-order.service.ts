import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface CustomerOrder {
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

export interface CustomerOrderCreateRequest {
  service: string;
  pickupLocation: string;
  dropoffLocation: string;
  orderDate: string;
  pickupTime: string;
  totalAmount: number;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerOrderService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiBaseUrl}/customer/orders`;

  getOrders(): Observable<CustomerOrder[]> {
    return this.http.get<CustomerOrder[]>(this.endpoint);
  }

  getActiveOrder(): Observable<CustomerOrder> {
    return this.http.get<CustomerOrder>(`${this.endpoint}/active`);
  }

  getOrderById(id: number): Observable<CustomerOrder> {
    return this.http.get<CustomerOrder>(`${this.endpoint}/${id}`);
  }

  createOrder(request: CustomerOrderCreateRequest): Observable<CustomerOrder> {
    return this.http.post<CustomerOrder>(this.endpoint, request);
  }
}
