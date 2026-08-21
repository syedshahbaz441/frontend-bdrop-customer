import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';

export interface DeliveryOrder {
  id: string;
  service: string;
  status: string;
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  eta: string;
  price: string;
  progress: number;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerJourneyService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiBaseUrl}/customer/orders`;

  getOrders(): Observable<DeliveryOrder[]> {
    return this.http.get<Array<{ id: number; service: string; status: string; pickupLocation: string; dropoffLocation: string; orderDate: string; pickupTime: string; estimatedArrival: string; totalAmount: number; progress: number }>>(this.endpoint).pipe(
      map((orders) =>
        orders.map((order) => ({
          id: `BD-${order.id}`,
          service: order.service,
          status: order.status,
          pickup: order.pickupLocation,
          dropoff: order.dropoffLocation,
          date: order.orderDate,
          time: order.pickupTime,
          eta: order.estimatedArrival,
          price: `$${order.totalAmount.toFixed(2)}`,
          progress: order.progress,
        })),
      ),
    );
  }

  getActiveOrder(): Observable<DeliveryOrder> {
    return this.http.get<{ id: number; service: string; status: string; pickupLocation: string; dropoffLocation: string; orderDate: string; pickupTime: string; estimatedArrival: string; totalAmount: number; progress: number }>(`${this.endpoint}/active`).pipe(
      map((order) => ({
        id: `BD-${order.id}`,
        service: order.service,
        status: order.status,
        pickup: order.pickupLocation,
        dropoff: order.dropoffLocation,
        date: order.orderDate,
        time: order.pickupTime,
        eta: order.estimatedArrival,
        price: `$${order.totalAmount.toFixed(2)}`,
        progress: order.progress,
      })),
    );
  }

  createOrder(order: Partial<DeliveryOrder>): Observable<DeliveryOrder> {
    return this.http
      .post<{ id: number; service: string; status: string; pickupLocation: string; dropoffLocation: string; orderDate: string; pickupTime: string; estimatedArrival: string; totalAmount: number; progress: number }>(this.endpoint, {
        service: order.service ?? 'Bike courier',
        pickupLocation: order.pickup ?? 'Pickup location',
        dropoffLocation: order.dropoff ?? 'Drop-off location',
        orderDate: order.date ?? 'Today',
        pickupTime: order.time ?? '4:30 PM',
        totalAmount: Number.parseFloat((order.price ?? '$24.00').replace(/[$,]/g, '')) || 24,
      })
      .pipe(
        map((created) => ({
          id: `BD-${created.id}`,
          service: created.service,
          status: created.status,
          pickup: created.pickupLocation,
          dropoff: created.dropoffLocation,
          date: created.orderDate,
          time: created.pickupTime,
          eta: created.estimatedArrival,
          price: `$${created.totalAmount.toFixed(2)}`,
          progress: created.progress,
        })),
      );
  }
}
