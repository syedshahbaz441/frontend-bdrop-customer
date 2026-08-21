import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
}

export interface AdminUserCreateRequest {
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminUserService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiBaseUrl}/admin/users`;

  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(this.endpoint);
  }

  getUserById(id: number): Observable<AdminUser> {
    return this.http.get<AdminUser>(`${this.endpoint}/${id}`);
  }

  createUser(request: AdminUserCreateRequest): Observable<AdminUser> {
    return this.http.post<AdminUser>(this.endpoint, request);
  }
}
