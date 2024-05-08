import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { flatMap, Observable } from 'rxjs';

import {
  QuestionsType,
  SimulatedFromCategoriesType
} from '../models/interface/simulated-from-categories.interface';
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
export class SimulatedFromCategoriesService {
  private httpClient = inject(HttpClient);

  getSimulatedFromCategoriesById(
    id: string | number
  ): Observable<SimulatedFromCategoriesType[]> {
    return this.httpClient.get<SimulatedFromCategoriesType[]>(
      `${BASE_URL}/simulado/categoria/simulado/${id}`,
      HEADER
    );
  }

  getSimulatedQuestionsById(id: string | number): Observable<QuestionsType[]> {
    return this.httpClient
      .get<SimulatedFromCategoriesType[]>(
        `${BASE_URL}/simulado/categoria/simulado/${id}`,
        HEADER
      )
      .pipe(
        flatMap(response => {
          const questions = response.map(item => item.perguntas);
          return questions;
        })
      );
  }
}
