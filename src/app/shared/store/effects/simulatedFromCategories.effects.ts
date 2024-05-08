import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SimulatedFromCategoriesService } from '@shared/services/simulatedFromCategories.service';

import { catchError, from, map, mergeMap, of } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import {
  CategoriesActions,
  CategoriesApiActions
} from '../actions/categories.actions';
import { MessageAction } from '../actions/message.actions';
import { SimulatedFromCategoriesApiActions } from '../actions/simulatedFromCategories.actions';

@Injectable()
export class SimulatedFromCategoriesByIdEffect {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private simulatedFromCategoriesService = inject(
    SimulatedFromCategoriesService
  );

  getSimulatedFromCategoriesById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.selectCategory),
      mergeMap(({ id }) =>
        from(
          this.simulatedFromCategoriesService
            .getSimulatedFromCategoriesById(id)
            .pipe(
              map(data =>
                SimulatedFromCategoriesApiActions.simulatedFromCategoriesLoadedSuccess(
                  {
                    categories: data
                  }
                )
              ),
              catchError((err: HttpErrorResponse) => {
                this.store.dispatch(
                  MessageAction.sendMessage({
                    message: {
                      severity: 'Error',
                      detail: `Erro ao tentar carregar categorias`
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
