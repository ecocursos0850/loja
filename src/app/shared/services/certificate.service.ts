import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Certificate } from '@shared/models/interface/certificate.interface';

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
export class CertificateService {
  private httpClient = inject(HttpClient);

  getCertificate(uuid: string): Observable<Certificate> {
    return this.httpClient.get<Certificate>(
      `${BASE_URL}/certificado/${uuid}`,
      HEADER
    );
  }
}
