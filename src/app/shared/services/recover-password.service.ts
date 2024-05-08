import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
export class RecoverPasswordService {
  private httpClient = inject(HttpClient);

  putChangePassword(password: string): Observable<string> {
    return this.httpClient.put<string>(
      `${BASE_URL}/change/password/${password}`,
      HEADER
    );
  }
}
