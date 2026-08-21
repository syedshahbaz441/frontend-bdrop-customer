import { Routes } from '@angular/router';

import { BookPage } from './pages/book.page';
import { HistoryPage } from './pages/history.page';
import { HomePage } from './pages/home.page';
import { LoginPage } from './pages/login.page';
import { TrackingPage } from './pages/tracking.page';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'home', component: HomePage },
  { path: 'book', component: BookPage },
  { path: 'tracking', component: TrackingPage },
  { path: 'history', component: HistoryPage },
  { path: '**', redirectTo: 'login' },
];
