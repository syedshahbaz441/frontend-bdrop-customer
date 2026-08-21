import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CustomerJourneyService, DeliveryOrder } from '../services/customer-journey.service';

@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="card history-card">
      <div class="section-header big-gap">
        <div>
          <span class="eyebrow">Orders</span>
          <h1>Order history</h1>
        </div>
        <a routerLink="/book" class="secondary-btn">New order</a>
      </div>

      <div class="history-list">
        @for (order of orders; track order.id) {
          <div class="history-row">
            <div>
              <strong>{{ order.id }}</strong>
              <small>{{ order.service }}</small>
            </div>
            <div>
              <strong>{{ order.date }}</strong>
              <small>{{ order.pickup }} → {{ order.dropoff }}</small>
            </div>
            <span class="status-pill {{ statusClass(order.status) }}">{{ order.status }}</span>
          </div>
        }
      </div>
    </section>
  `,
  styleUrl: '../app.css',
})
export class HistoryPage implements OnInit {
  private readonly journeyService = inject(CustomerJourneyService);
  orders: DeliveryOrder[] = [];

  ngOnInit(): void {
    this.journeyService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
      },
    });
  }

  statusClass(status: string): string {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'On the way':
        return 'warning';
      case 'Order placed':
        return 'neutral';
      default:
        return 'neutral';
    }
  }
}
