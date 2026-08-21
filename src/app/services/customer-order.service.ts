import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface CustomerOrder {
  id: number;
  status: string;
  totalAmount: number;
}

export interface CustomerOrderCreateRequest {
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

  getOrderById(id: number): Observable<CustomerOrder> {
    return this.http.get<CustomerOrder>(`${this.endpoint}/${id}`);
  }

  createOrder(request: CustomerOrderCreateRequest): Observable<CustomerOrder> {
    return this.http.post<CustomerOrder>(this.endpoint, request);
  }
}
