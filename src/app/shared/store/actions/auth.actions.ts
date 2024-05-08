import { HttpErrorResponse } from '@angular/common/http';
import { LoginInterface } from '@shared/models/interface/login.interface';

import { createActionGroup, emptyProps, props } from '@ngrx/store';

export interface LoginState {
  gettingStatus: boolean;
  user: LoginInterface | null;
  error: HttpErrorResponse | null;
}

export const LoginActions = createActionGroup({
  source: 'Login',
  events: {
    Enter: emptyProps(),
    Logout: emptyProps(),
    Login: props<{ user: LoginInterface }>()
  }
});

export const LoginApiActions = createActionGroup({
  source: 'Login Api',
  events: {
    Enter: emptyProps(),
    'Login Loaded': props<{
      user: LoginInterface;
    }>(),
    'Get Login Status Success': props<{
      user: LoginInterface | null;
    }>(),
    'Login Failure': props<{
      error: HttpErrorResponse;
    }>(),
    'Login Success': props<{
      user: LoginInterface;
    }>(),
    'Logout Failure': props<{
      error: HttpErrorResponse;
    }>(),
    'Logout Success': props<{
      user: null;
    }>()
  }
});
