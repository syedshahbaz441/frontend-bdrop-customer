import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="card auth-card">
      <span class="eyebrow">Welcome back</span>
      <h1>Sign in to BuddyDrop</h1>
      <p class="subtitle">Manage your deliveries and stay updated in real time.</p>

      <form class="stacked-form">
        <label>
          <span>Email</span>
          <input type="email" value="olivia@buddydrop.com" />
        </label>

        <label>
          <span>Password</span>
          <input type="password" value="password123" />
        </label>

        <a routerLink="/home" class="primary-btn full-width">Sign in</a>
      </form>

      <div class="inline-row auth-footer">
        <span>Need an account?</span>
        <a routerLink="/home">Create one</a>
      </div>
    </section>
  `,
  styleUrl: '../app.css',
})
export class LoginPage {}
