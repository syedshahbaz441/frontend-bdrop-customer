import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HealthService } from './services/health.service';
import { AdminProductService } from './services/admin-product.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('BuddyDrop Admin');
  protected readonly backendStatus = signal('Checking backend connection...');
  protected readonly backendDetails = signal('Waiting for Spring Boot...');
  protected readonly adminStatus = signal('Checking admin service...');

  private readonly healthService = inject(HealthService);
  private readonly adminProductService = inject(AdminProductService);

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

    this.adminProductService.getProducts().subscribe({
      next: () => this.adminStatus.set('Admin service connected'),
      error: () => this.adminStatus.set('Admin service unavailable'),
    });
  }
}
