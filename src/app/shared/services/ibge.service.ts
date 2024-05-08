import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IbgeInterfaceModel } from '@shared/models/classes/ibge.interface.model';

import { catchError, map, Observable, throwError } from 'rxjs';

const BASE_URL = 'https://viacep.com.br/ws/';
const HEADER = {
  headers: new HttpHeaders({
    'Content-type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class IbgeService {
  private httpClient = inject(HttpClient);
  getIbgeInformation(cep: string): Observable<IbgeInterfaceModel> {
    return this.httpClient
      .get<IbgeInterfaceModel>(`${BASE_URL}/${cep}/json/`, HEADER)
      .pipe(
        map(
          (data: IbgeInterfaceModel) => {
            if (data.erro) throw new Error('Erro na consulta do CEP');

            const ibgeValue: IbgeInterfaceModel = {
              ...data
            };

            return ibgeValue;
          },
          catchError(error => {
            console.error(error);
            return throwError('Nào foi possível encontrar o CEP');
          })
        )
      );
  }
}
