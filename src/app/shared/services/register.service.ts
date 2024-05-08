import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { RegisterType } from '@shared/models/interface/register.interface';
import { UserDetailsModel } from '@shared/models/classes/user-details.model';

import { Observable } from 'rxjs';

import { Environment as env } from '../../../environments/environment';

const BASE_URL = env.base_url;

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private httpClient = inject(HttpClient);

  registerUser(
    register: RegisterType
  ): Observable<UserDetailsModel | HttpErrorResponse> {
    return this.httpClient.post<UserDetailsModel>(
      `${BASE_URL}/aluno`,
      register
    );
  }
}
