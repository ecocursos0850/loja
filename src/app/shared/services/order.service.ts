import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { OrderModel } from '@shared/models/classes/order.model';
import { OrderAlready } from '@shared/models/interface/oreder-already.interface';

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
export class OrderService {
  private httpClient = inject(HttpClient);

  addOrder(order: OrderModel): Observable<OrderAlready> {
    return this.httpClient.post<OrderAlready>(
      `${BASE_URL}/pedido`,
      order,
      HEADER
    );
  }
}
