import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HealthService } from './services/health.service';
import { CustomerProfileService } from './services/customer-profile.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('BuddyDrop Customer');
  protected readonly backendStatus = signal('Checking backend connection...');
  protected readonly backendDetails = signal('Waiting for Spring Boot...');
  protected readonly customerStatus = signal('Checking customer service...');

  private readonly healthService = inject(HealthService);
  private readonly customerProfileService = inject(CustomerProfileService);

  constructor() {
    this.healthService.getHealth().subscribe({
      next: (response) => {
        this.backendStatus.set(`${response.service} is ${response.status}`);
        this.backendDetails.set(`Last heartbeat: ${response.timestamp}`);
      },
      error: () => {
        this.backendStatus.set('Backend connection failed');
        this.backendDetails.set('Make sure the Java app is running on http://localhost:8081');
      },
    });

    this.customerProfileService.getProfile().subscribe({
      next: () => this.customerStatus.set('Customer service connected'),
      error: () => this.customerStatus.set('Customer service unavailable'),
    });
  }
}
