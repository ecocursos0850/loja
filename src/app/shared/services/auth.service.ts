import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginInterface } from '@shared/models/interface/login.interface';
import { UserDetailsModel } from '@shared/models/classes/user-details.model';

import { map, Observable, of, throwError } from 'rxjs';

import * as uuid from 'uuid';

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
export class AuthService {
  private httpClient = inject(HttpClient);
  private redirectUrl = signal<string | null>(null);

  login(loginProps: LoginInterface): Observable<any> {
    return this.httpClient
      .post<any>(
        `${BASE_URL}/api/v1/auth/authenticate`,
        JSON.stringify(loginProps),
        HEADER
      )
      .pipe(
        map(response => {
          const token = response.token;
          localStorage.setItem('jwt_token', token); // Armazena o token JWT
          return response.user;
        })
      );
  }

  getUserDetails(student: string): Observable<UserDetailsModel[]> {
    return this.httpClient.get<UserDetailsModel[]>(
      `${BASE_URL}/aluno/search?email=${student}`,
      HEADER
    );
  }

  logout(): Observable<string> {
    const userString = localStorage.getItem('auth');
    const user = userString ? JSON.parse(userString) : null;
    if (user) {
      localStorage.removeItem('auth');
      localStorage.removeItem('cart');
      return of('success');
    } else {
      return throwError(new Error('Falha ao sair'));
    }
  }

  getStatus(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      // Retorna o token JWT armazenado
      return of(token);
    } else {
      return throwError(new Error('Usuário não autenticado'));
    }
  }

  setRedirectUrl(url: string): void {
    this.redirectUrl.set(url);
  }

  getRedirectUrl(): string | null {
    const url = this.redirectUrl();
    this.redirectUrl.set(null);
    return url;
  }
}
