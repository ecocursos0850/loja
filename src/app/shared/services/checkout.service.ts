import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DirectBillingModel } from '@shared/models/classes/direct-billing.model';

import { Observable } from 'rxjs';

import { Environment as env } from '../../../environments/environment';

const BASE_URL = env.base_url;
const API_KEY = env.token;

const HEADER = {
  headers: new HttpHeaders({
    'Content-type': 'application/json',
    Authorization: API_KEY,
    responseType: 'text' as 'json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private httpClient = inject(HttpClient);

  addCheckout(checkout: DirectBillingModel): Observable<string> {
    return this.httpClient.post<string>(
      `${BASE_URL}/pedido/cobranca/direta`,
      JSON.stringify(checkout),
      HEADER
    );
  }
}
