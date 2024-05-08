import { inject, Injectable } from '@angular/core';
import {
  CartActions,
  CartApiActions
} from '@shared/store/actions/cart.actions';
import { AuthService } from '@shared/services/auth.service';
import { LoginInterface } from '@shared/models/interface/login.interface';
import { Router } from '@angular/router';
import { MessageAction } from '@shared/store/actions/message.actions';
import { HttpErrorResponse } from '@angular/common/http';

import {
  catchError,
  exhaustMap,
  map,
  mergeMap,
  of,
  tap,
  withLatestFrom
} from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

@Injectable()
export class CartEffect {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private authService = inject(AuthService);
  private router = inject(Router);

  addCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.addItemToCart),
      withLatestFrom(this.store),
      exhaustMap(([action, state]) =>
        this.authService.getStatus().pipe(
          map(userStatus => ({ action, state, userStatus })),
          mergeMap(({ action, state, userStatus }) => {
            return this.saveSuccessInLocalStorage(action, state, userStatus);
          }),
          catchError((err: HttpErrorResponse) => {
            this.store.dispatch(
              MessageAction.sendMessage({
                message: {
                  severity: 'Error',
                  detail: `Erro ao adicionar um item`
                }
              })
            );

            this.authService.setRedirectUrl('categorias');
            this.router.navigate(['login']);

            return of(CartApiActions.cartLoadedFailed({ error: err.message }));
          })
        )
      )
    )
  );

  getCart$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.enter),
        withLatestFrom(this.store),
        tap(() => {
          const storageData = localStorage.getItem('cart');
          if (storageData) {
            const parsedJson = JSON.parse(storageData);
            this.store.dispatch(
              CartApiActions.cartLoadedSuccess({ cart: parsedJson })
            );
          }
        })
      ),
    { dispatch: false }
  );

  removeCart$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.removeItemToCart),
        withLatestFrom(this.store),
        tap(([action, state]) => {
          localStorage.setItem('cart', JSON.stringify(state.cart.collection));
        })
      ),
    { dispatch: false }
  );

  removeAllCart$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.clearAllItemsToCart),
        withLatestFrom(this.store),
        tap(([action, state]) => {
          localStorage.setItem('cart', JSON.stringify(state.cart.collection));
        })
      ),
    { dispatch: false }
  );

  saveSuccessInLocalStorage = (
    action: any,
    state: any,
    userStatus: LoginInterface
  ) => {
    if (userStatus.email) {
      const cartString = JSON.stringify(state.cart.collection);
      localStorage.setItem('cart', cartString);
      this.store.dispatch(
        MessageAction.sendMessage({
          message: {
            severity: 'Success',
            detail: `Item adicionado: ${action.item.titulo}`
          }
        })
      );

      return of(
        CartApiActions.cartLoadedSuccess({
          cart: state.cart.collection
        })
      );
    } else {
      return of(
        CartApiActions.cartLoadedFailed({
          error: 'Usuário não autenticado'
        })
      );
    }
  };
}
