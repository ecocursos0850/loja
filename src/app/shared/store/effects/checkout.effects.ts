import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CheckoutService } from '@shared/services/checkout.service';
import { PaginatorComponent } from '@shared/components/Paginator';

import { catchError, from, map, of, switchMap, tap } from 'rxjs';

import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import {
  CheckoutActions,
  CheckoutApiActions
} from '../actions/checkout.actions';
import { CartActions } from '../actions/cart.actions';
import { ModalAction } from '../actions/modal.actions';

@Injectable()
export class CheckoutEffect {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private checkoutService = inject(CheckoutService);

  addCheckout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CheckoutActions.selectCheckout),
      tap(() => {
        this.store.dispatch(
          ModalAction.open({
            modal: {
              component: PaginatorComponent,
              state: true,
              page: 'credit-card'
            }
          })
        );
      }),
      switchMap(({ checkout }) =>
        from(
          this.checkoutService.addCheckout(checkout).pipe(
            map((checkoutData: string) => {
              return CheckoutApiActions.checkoutLoadedSuccess({
                checkout: checkoutData
              });
            }),
            tap(() => {
              this.store.dispatch(ModalAction.status({ status: 'success' }));
              this.store.dispatch(CartActions.clearAllItemsToCart());
            }),
            catchError((err: HttpErrorResponse) => {
              this.store.dispatch(ModalAction.status({ status: 'fail' }));
              return of(
                CheckoutApiActions.checkoutLoadedFailed({ error: err })
              );
            })
          )
        )
      )
    )
  );
}
