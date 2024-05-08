import { LoadingAction } from '@shared/store/actions/loading.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageAction } from '@shared/store/actions/message.actions';
import { inject, Injectable } from '@angular/core';
import { DiscountCouponService } from '@shared/services/discount-coupon.service';
import {
  DiscountCouponActions,
  DiscountCouponApiActions
} from '@shared/store/actions/discount-coupon.actions';

import { catchError, from, map, mergeMap, of, tap } from 'rxjs';

import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

@Injectable()
export class DiscountCouponEffect {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private discountCouponService = inject(DiscountCouponService);

  postDiscountCoupon$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DiscountCouponActions.selectCoupon),
      mergeMap(({ id }) =>
        from(
          this.discountCouponService.getDiscountCoupon(id).pipe(
            map(couponData => {
              return DiscountCouponApiActions.discountCouponLoadedSuccess({
                coupon: couponData
              });
            }),
            tap(() => {
              this.store.dispatch(LoadingAction.loading({ message: true }));
            }),
            catchError((err: HttpErrorResponse) => {
              this.store.dispatch(LoadingAction.loading({ message: false }));
              this.store.dispatch(
                MessageAction.sendMessage({
                  message: {
                    severity: 'Error',
                    detail: `Erro ao tentar carregar cupom de desconto`
                  }
                })
              );
              return of(
                DiscountCouponApiActions.discountCouponLoadedFailed({
                  error: err
                })
              );
            })
          )
        )
      )
    )
  );
}
