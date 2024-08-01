import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CategoriesTopicsType } from '@shared/models/interface/categoires-topics.interface';

import { map, Observable, tap } from 'rxjs';

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
export class CategoriesTopicsService {
  private httpClient = inject(HttpClient);

  getAllCategoriesTopics(): Observable<CategoriesTopicsType[]> {
    return this.httpClient
      .get<CategoriesTopicsType[]>(`${BASE_URL}/categoria`, HEADER)
      .pipe(tap(x => x.forEach(x => console.log("subcategorias" + x.subCategorias.toString()))),map(course => course.filter(res => res.status === 1)));
  }
}
