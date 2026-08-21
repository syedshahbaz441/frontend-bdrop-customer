import { Component, inject, OnInit } from '@angular/core';

import { CustomerJourneyService, DeliveryOrder } from '../services/customer-journey.service';

@Component({
  selector: 'app-tracking-page',
  standalone: true,
  template: `
    @if (activeOrder) {
      <section class="card tracking-card">
        <div class="section-header big-gap">
          <div>
            <span class="eyebrow">Live tracking</span>
            <h1>Order {{ activeOrder.id }}</h1>
          </div>
          <span class="status-pill warning">{{ activeOrder.status }}</span>
        </div>

        <div class="tracking-overview">
          <div>
            <small>Pickup</small>
            <strong>{{ activeOrder.pickup }}</strong>
          </div>
          <div>
            <small>Drop-off</small>
            <strong>{{ activeOrder.dropoff }}</strong>
          </div>
          <div>
            <small>ETA</small>
            <strong>{{ activeOrder.eta }}</strong>
          </div>
        </div>

        <div class="progress-block">
          <div class="progress-line">
            <span [style.width.%]="activeOrder.progress"></span>
          </div>
          <small>{{ activeOrder.progress }}% completed</small>
        </div>

        <div class="timeline">
          <div class="timeline-item complete">
            <span class="dot"></span>
            <div>
              <strong>Order placed</strong>
              <small>{{ activeOrder.date }}</small>
            </div>
          </div>
          <div class="timeline-item complete">
            <span class="dot"></span>
            <div>
              <strong>Driver assigned</strong>
              <small>1:05 PM</small>
            </div>
          </div>
          <div class="timeline-item active">
            <span class="dot"></span>
            <div>
              <strong>On the way</strong>
              <small>Current step</small>
            </div>
          </div>
          <div class="timeline-item">
            <span class="dot"></span>
            <div>
              <strong>Delivered</strong>
              <small>ETA {{ activeOrder.eta }}</small>
            </div>
          </div>
        </div>
      </section>
    }
  `,
  styleUrl: '../app.css',
})
export class TrackingPage implements OnInit {
  private readonly journeyService = inject(CustomerJourneyService);
  activeOrder: DeliveryOrder | null = null;

  ngOnInit(): void {
    this.journeyService.getActiveOrder().subscribe({
      next: (order) => {
        this.activeOrder = order;
      },
    });
  }
}
