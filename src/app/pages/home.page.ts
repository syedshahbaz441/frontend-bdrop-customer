import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CustomerJourneyService, DeliveryOrder } from '../services/customer-journey.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero-panel">
      <div>
        <p class="eyebrow">Good afternoon</p>
        <h1>Welcome back, Olivia</h1>
        <p class="subtitle">You have {{ recentOrders.length }} active deliveries moving today. Keep an eye on their progress.</p>
      </div>

      <div class="primary-actions">
        <a routerLink="/book" class="primary-btn">Book a service</a>
        <a routerLink="/tracking" class="secondary-btn">Track order</a>
      </div>
    </section>

    <section class="stats-grid">
      <article class="stat-tile">
        <span>Active orders</span>
        <strong>{{ recentOrders.length }}</strong>
      </article>
      <article class="stat-tile">
        <span>Monthly spend</span>
        <strong>{{ '$' + monthlySpend }}</strong>
      </article>
      <article class="stat-tile">
        <span>Next pickup</span>
        <strong>{{ nextPickup }}</strong>
      </article>
    </section>

    <section class="two-column">
      <div class="card">
        <div class="section-header">
          <h2>Recent activity</h2>
          <a routerLink="/history">View all</a>
        </div>

        <div class="list-block">
          @for (order of recentOrders; track order.id) {
            <div class="list-item">
              <div>
                <strong>{{ order.service }}</strong>
                <small>{{ order.pickup }} → {{ order.dropoff }}</small>
              </div>
              <span class="status-pill {{ statusClass(order.status) }}">{{ order.status }}</span>
            </div>
          }
        </div>
      </div>

      <div class="card">
        <div class="section-header">
          <h2>Popular services</h2>
        </div>

        <div class="service-grid">
          <div class="service-box">
            <span>Bike courier</span>
            <strong>Fast</strong>
          </div>
          <div class="service-box">
            <span>Car delivery</span>
            <strong>Comfort</strong>
          </div>
          <div class="service-box">
            <span>Same-day</span>
            <strong>Urgent</strong>
          </div>
          <div class="service-box">
            <span>Moving help</span>
            <strong>Large</strong>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: '../app.css',
})
export class HomePage implements OnInit {
  private readonly journeyService = inject(CustomerJourneyService);
  recentOrders: DeliveryOrder[] = [];
  monthlySpend = '0.00';
  nextPickup = '—';

  ngOnInit(): void {
    this.journeyService.getOrders().subscribe({
      next: (orders) => {
        this.recentOrders = orders.slice(0, 3);
        this.monthlySpend = (orders.reduce((sum, order) => sum + Number.parseFloat(order.price.replace(/[$,]/g, '')), 0) / 2).toFixed(2);
        this.nextPickup = orders[0]?.time ?? '—';
      },
    });
  }

  statusClass(status: string): string {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'On the way':
        return 'warning';
      default:
        return 'neutral';
    }
  }
}
