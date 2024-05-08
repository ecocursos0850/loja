import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DiscountCouponType } from '@shared/models/classes/ticket.interface.model';

import { Observable } from 'rxjs';

import { Environment as env } from '../../../environments/environment';

const BASE_URL = env.base_url;
const API_KEY = env.token;

const HEADER = {
  headers: new HttpHeaders({
    'Content-type': 'application/json',
    Authorization: API_KEY
  })
};

@Injectable({
  providedIn: 'root'
})
export class DiscountCouponService {
  private httpClient = inject(HttpClient);

  getDiscountCoupon(id: string): Observable<DiscountCouponType> {
    return this.httpClient.get<DiscountCouponType>(
      `${BASE_URL}/cupom/desconto/cupom/${id}`,
      HEADER
    );
  }
}
