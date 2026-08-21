import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface AdminProduct {
  id: number;
  name: string;
  category: string;
  price: number;
}

export interface AdminProductCreateRequest {
  name: string;
  category: string;
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminProductService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiBaseUrl}/admin/products`;

  getProducts(): Observable<AdminProduct[]> {
    return this.http.get<AdminProduct[]>(this.endpoint);
  }

  getProductById(id: number): Observable<AdminProduct> {
    return this.http.get<AdminProduct>(`${this.endpoint}/${id}`);
  }

  createProduct(request: AdminProductCreateRequest): Observable<AdminProduct> {
    return this.http.post<AdminProduct>(this.endpoint, request);
  }
}
