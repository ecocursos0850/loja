import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BankSlipModel } from '@shared/models/classes/bank-slip.model';
import { PDFType } from '@shared/models/interface/pdf.interface';

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
export class TicketService {
  private httpClient = inject(HttpClient);

  ticketPayment(ticket: BankSlipModel): Observable<PDFType> {
    return this.httpClient.post<PDFType>(
      `${BASE_URL}/pedido/cobranca/direta`,
      JSON.stringify(ticket),
      HEADER
    );
  }
}
