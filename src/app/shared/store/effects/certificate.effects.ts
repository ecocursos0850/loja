import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CertificateService } from '@shared/services/certificate.service';

import { catchError, from, map, of, switchMap, tap } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { MessageAction } from '../actions/message.actions';
import {
  CertificateActions,
  CertificateApiActions
} from '../actions/auth-certificate.actions';

@Injectable()
export class CertificateEffect {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private certificateService = inject(CertificateService);

  getCertificate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CertificateActions.selectCertificate),
      switchMap(({ uuid }) =>
        from(
          this.certificateService.getCertificate(uuid).pipe(
            map(data =>
              CertificateApiActions.certificateSuccess({
                certificate: data
              })
            ),
            tap(() => {
              this.store.dispatch(
                MessageAction.sendMessage({
                  message: {
                    severity: 'Success',
                    detail: `Certificado Autenticado com sucesso!`
                  }
                })
              );
            }),
            catchError((err: HttpErrorResponse) => {
              this.store.dispatch(
                MessageAction.sendMessage({
                  message: {
                    severity: 'Error',
                    detail: `Por favor, insira um número válido!`
                  }
                })
              );
              return of(
                CertificateApiActions.certificateFailure({ error: err })
              );
            })
          )
        )
      )
    )
  );
}
