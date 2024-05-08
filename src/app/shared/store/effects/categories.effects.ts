import { inject, Injectable } from '@angular/core';
import { SimulatedCategoriesService } from '@shared/services/simulated-categories.service';
import { HttpErrorResponse } from '@angular/common/http';

import { catchError, from, map, of, switchMap, tap, throttleTime } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import {
  CategoriesActions,
  CategoriesApiActions
} from '../actions/categories.actions';
import { MessageAction } from '../actions/message.actions';
import { CategoriesType } from '../../models/interface/categories.interface';
import { LoadingAction } from '../actions/loading.actions';

@Injectable()
export class CategoriesEffect {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private simulatedCategoriesService = inject(SimulatedCategoriesService);

  getCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.enter),
      throttleTime(10000),
      switchMap(() =>
        from(
          this.simulatedCategoriesService.getAllCategories().pipe(
            map((categoriesData: CategoriesType[]) => {
              this.store.dispatch(LoadingAction.loading({ message: false }));
              return CategoriesApiActions.categoriesLoadedSuccess({
                categories: categoriesData
              });
            }),
            tap(() => {
              this.store.dispatch(LoadingAction.loading({ message: false }));
            }),
            catchError((err: HttpErrorResponse) => {
              this.store.dispatch(LoadingAction.loading({ message: false }));
              this.store.dispatch(
                MessageAction.sendMessage({
                  message: {
                    severity: 'Error',
                    detail: `Erro ao tentar carregar as categorias`
                  }
                })
              );
              return of(
                CategoriesApiActions.categoriesLoadedFailed({ error: err })
              );
            })
          )
        )
      )
    )
  );
}
