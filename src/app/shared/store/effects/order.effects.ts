import { inject, Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageAction } from '@shared/store/actions/message.actions';
import { LoadingAction } from '@shared/store/actions/loading.actions';
import { OrderService } from '@shared/services/order.service';
import { OrderAlready } from '@shared/models/interface/oreder-already.interface';
import { Router } from '@angular/router';
import { RouterByPaymentEnum } from '@shared/models/enum/payment-type.enum';
import { CartType } from '@shared/models/classes/cart-market.model';

import { catchError, combineLatest, from, map, of, switchMap, tap } from 'rxjs';

import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { OrderActions, OrderApiActions } from '../actions/order.actions';
import { CartActions } from '../actions/cart.actions';
import {
  userDetailsAvailableHoursSelect,
  userDetailsPartner
} from '../reducers/user-details.reducer';
import {
  cartItemsSelector,
  cartTotalHoursSelector
} from '../reducers/cart.reducer';

@Injectable()
export class OrderEffect {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private orderService = inject(OrderService);
  private router = inject(Router);

  orderReference = signal<string>('');
  paymentType = signal<number[]>([0]);

  orderInProgress = false; // Added flag to track whether an order is in progress

  addOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.selectOrder),
      tap(() => {
        if (this.orderInProgress) {
          // If an order is already in progress, ignore the request
          return;
        }

        this.orderInProgress = true; // Set the flag to indicate that an order is in progress
        this.store.dispatch(LoadingAction.loading({ message: true }));
      }),
      switchMap(({ order }) =>
        from(
          this.orderService.addOrder(order).pipe(
            map((orderData: OrderAlready) => {
              this.orderReference.set(orderData.referencia);
              this.paymentType.update(() => orderData.tipoPagamentos);

              return OrderApiActions.orderLoadedSuccess({
                order: orderData
              });
            }),
            tap(() => {
              this.store.dispatch(LoadingAction.loading({ message: false }));
              this.goToPageByPaymentType();
              this.orderInProgress = false; // Reset the flag after completing the order
            }),
            catchError((err: HttpErrorResponse) => {
              this.store.dispatch(LoadingAction.loading({ message: false }));
              this.store.dispatch(
                MessageAction.sendMessage({
                  message: {
                    severity: 'Error',
                    detail: err.error.message
                  }
                })
              );
              this.orderInProgress = false; // Reset the flag in case of an error
              return of(OrderApiActions.orderLoadedFailed({ error: err }));
            })
          )
        )
      )
    )
  );

goToPageByPaymentType(): void {
  if (this.hoursAvailable) {
    this.store.dispatch(CartActions.clearAllItemsToCart());
    this.router.navigate([this.routeToGo]);
    this.store.dispatch(LoadingAction.loading({ message: false }));
    this.store.dispatch(
      MessageAction.sendMessage({
        message: {
          severity: 'Success',
          detail: `Sua matrícula foi feita com sucesso, acesse o portal do aluno para assistir ao seu curso adquirido.`
        }
      })
    );
    setTimeout(() => {
      location.reload();
    }, 4000);

  } else {
    this.router.navigate([
      'carrinho-de-compras',
      this.routeToGo,
      this.orderReference()
    ]);
    this.store.dispatch(LoadingAction.loading({ message: false }));
    this.store.dispatch(
      MessageAction.sendMessage({
        message: {
          severity: 'Success',
          detail: `O checkout foi criado. Se acha que isso foi um engano e o curso é gratuito para você filiado(a), entre em contato conosco.`
        }
      })
    );
  }
}



  get routeToGo(): string {
    let routeType = '';
    this.paymentType().map(res => {
      routeType =
        res === 1 || res === 2 || res === 3
          ? RouterByPaymentEnum[1]
          : RouterByPaymentEnum[0];
    });
    return routeType;
  }

  get hoursAvailable(): boolean {
    let isAvailable = false;
    combineLatest([
      this.store.select(userDetailsAvailableHoursSelect),
      this.store.select(cartTotalHoursSelector),
      this.store.select(userDetailsPartner),
      this.store.select(cartItemsSelector)
    ]).subscribe(
      ([userHoursAvailable, cartTotalHours, userDetailsPartner, cartItems]) => {
        isAvailable =
          this.isAllLawOnline(cartItems) &&
          userDetailsPartner &&
          userHoursAvailable &&
          cartTotalHours <= userHoursAvailable
            ? true
            : false;
      }
    );
    return isAvailable;
  }

  isAllLawOnline(courses: CartType[]): boolean {
    return courses.every(
      course => course.categoria.titulo === 'DIREITO ONLINE'
    );
  }
}
