import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface CustomerProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
}

export interface CustomerProfileUpdateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerProfileService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiBaseUrl}/customer/profile`;

  getProfile(): Observable<CustomerProfile> {
    return this.http.get<CustomerProfile>(this.endpoint);
  }

  updateProfile(request: CustomerProfileUpdateRequest): Observable<CustomerProfile> {
    return this.http.put<CustomerProfile>(this.endpoint, request);
  }
}
