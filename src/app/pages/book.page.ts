import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CustomerJourneyService } from '../services/customer-journey.service';

@Component({
  selector: 'app-book-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="card booking-card">
      <div class="section-header big-gap">
        <div>
          <span class="eyebrow">Create order</span>
          <h1>Book a service</h1>
        </div>
      </div>

      <form class="stacked-form" (ngSubmit)="submitOrder()">
        <label>
          <span>Service type</span>
          <select [(ngModel)]="order.service" name="service">
            <option>Bike courier</option>
            <option>Car delivery</option>
            <option>Same-day delivery</option>
            <option>Package transfer</option>
          </select>
        </label>

        <div class="two-field-grid">
          <label>
            <span>Pickup</span>
            <input [(ngModel)]="order.pickup" name="pickup" type="text" />
          </label>

          <label>
            <span>Drop-off</span>
            <input [(ngModel)]="order.dropoff" name="dropoff" type="text" />
          </label>
        </div>

        <div class="two-field-grid">
          <label>
            <span>Date</span>
            <input [(ngModel)]="order.date" name="date" type="text" />
          </label>

          <label>
            <span>Time</span>
            <input [(ngModel)]="order.time" name="time" type="text" />
          </label>
        </div>

        <div class="summary-box">
          <span>Estimated total</span>
          <strong>$24.00</strong>
        </div>

        <button type="submit" class="primary-btn full-width">Confirm booking</button>
      </form>
    </section>
  `,
  styleUrl: '../app.css',
})
export class BookPage {
  order = {
    service: 'Bike courier',
    pickup: 'Riverside Market',
    dropoff: 'City Hall',
    date: 'Today',
    time: '4:30 PM',
  };

  constructor(
    private readonly journeyService: CustomerJourneyService,
    private readonly router: Router,
  ) {}

  submitOrder(): void {
    this.journeyService
      .createOrder({
        ...this.order,
        price: '$24.00',
      })
      .subscribe({
        next: () => this.router.navigateByUrl('/tracking'),
      });
  }
}
