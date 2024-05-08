import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { CategoriesType } from '../models/interface/categories.interface';
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
export class SimulatedCategoriesService {
  private httpClient = inject(HttpClient);

  getAllCategories(): Observable<CategoriesType[]> {
    return this.httpClient.get<CategoriesType[]>(
      `${BASE_URL}/categoria/simulado`,
      HEADER
    );
  }
}
