import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { IbgeService } from '@shared/services/ibge.service';
import {
  IbgeInformationActions,
  IbgeInformationApiActions
} from '@shared/store/actions/cep-information.actions';

import { catchError, from, map, mergeMap, of, switchMap } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { MessageAction } from '../actions/message.actions';

@Injectable()
export class IbgeEffect {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private IbgeService = inject(IbgeService);

  getIbgeInformations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IbgeInformationActions.selectIbgeInfor),
      switchMap(({ value }) =>
        from(
          this.IbgeService.getIbgeInformation(value).pipe(
            map(ibgeData =>
              IbgeInformationApiActions.ibgeLoadedSuccess({
                information: ibgeData
              })
            ),
            catchError((err: HttpErrorResponse) => {
              this.store.dispatch(
                MessageAction.sendMessage({
                  message: {
                    severity: 'Error',
                    detail: `Informação da cidade não carregada`
                  }
                })
              );
              return of(
                IbgeInformationApiActions.ibgeLoadedFailed({ error: err })
              );
            })
          )
        )
      )
    )
  );
}
