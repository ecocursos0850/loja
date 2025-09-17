import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginInterface } from '@shared/models/interface/login.interface';
import { AuthService } from '@shared/services/auth.service';
import {
  LoginActions,
  LoginApiActions
} from '@shared/store/actions/auth.actions';
import { UserDetailsModel } from '@shared/models/classes/user-details.model';

import {
  catchError,
  from,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  tap
} from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { MessageAction } from '../actions/message.actions';
import {
  UserDetailsActions,
  UserDetailsApiActions
} from '../actions/user-details.actions';
import { LoadingAction } from '../actions/loading.actions';
import { userDetailsSelect } from '../reducers/user-details.reducer';
import { loginSelectUser } from '../reducers/auth.reducer';

@Injectable()
export class AuthEffect {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private authService = inject(AuthService);
  private router = inject(Router);

  getAuthStatus$ = createEffect(() =>
    this.authService
      .getStatus()
      .pipe(
        map(userOrNull =>
          LoginApiActions.getLoginStatusSuccess({ user: userOrNull })
        )
      )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginActions.login),
      tap(() => this.store.dispatch(LoadingAction.loading({ message: true }))),
      mergeMap(({ user }) =>
        from(this.authService.login(user)).pipe(
          map((loginData: LoginInterface) => {
            return LoginApiActions.loginSuccess({
              user: loginData
            });
          }),
          tap(() => {
            this.store.dispatch(LoadingAction.loading({ message: false }));
            this.store.dispatch(
              MessageAction.sendMessage({
                message: {
                  severity: 'Success',
                  detail: `Login feito com sucesso`
                }
              })
            );

            const urlContent = this.authService.getRedirectUrl();
            if (urlContent) this.router.navigate([urlContent]);
            else this.router.navigate(['']);
          }),
          catchError((err: HttpErrorResponse): Observable<any> => {
            this.store.dispatch(LoadingAction.loading({ message: false }));
            this.store.dispatch(
              MessageAction.sendMessage({
                message: {
                  severity: 'Error',
                  detail: `E-mail ou senha estão incorretos.`
                }
              })
            );
            return of(LoginApiActions.loginFailure({ error: err }));
          })
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginActions.logout),
      switchMap(() =>
        from(this.authService.logout()).pipe(
          map(() => {
            return LoginApiActions.logoutSuccess({
              user: null
            });
          }),
          tap(() => {
            this.store.dispatch(UserDetailsActions.clear());
            window.location.replace('');
          }),
          catchError((err: HttpErrorResponse): Observable<any> => {
            this.store.dispatch(
              MessageAction.sendMessage({
                message: {
                  severity: 'Error',
                  detail: `Erro ao tentar sair`
                }
              })
            );
            return of(UserDetailsApiActions.clearFailure({ error: err }));
          })
        )
      )
    )
  );

  getUserDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserDetailsActions.user),
      mergeMap(({ email }) =>
        from(this.authService.getUserDetails(email)).pipe(
          map((userData: UserDetailsModel[]) => {
            return UserDetailsApiActions.userDetailsSuccess({
              user: this.hasValidUser ? userData : [new UserDetailsModel()]
            });
          }),
          catchError((err: HttpErrorResponse): Observable<any> => {
            this.store.dispatch(
              MessageAction.sendMessage({
                message: {
                  severity: 'Error',
                  detail: `Erro ao pegar informações do usuário! Se você estiver acessando de algum tribunal, eles podem estar bloqueando a conexão.`
                }
              })
            );
            return of(LoginApiActions.loginFailure({ error: err }));
          })
        )
      )
    )
  );

  get hasValidUser(): boolean {
    let hasUser = false;
    this.store.select(loginSelectUser).subscribe({
      next: user => {
        if (user) hasUser = true;
      }
    });

    return hasUser;
  }
}
