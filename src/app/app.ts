import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly navItems = [
    { label: 'Home', route: '/home' },
    { label: 'Book', route: '/book' },
    { label: 'Tracking', route: '/tracking' },
    { label: 'History', route: '/history' },
  ];
}
