import { HttpErrorResponse } from '@angular/common/http';

import { createActionGroup, emptyProps, props } from '@ngrx/store';

export type StateStatus = 'Saved' | 'Error';

export interface RecoverPasswordState {
  collection: string;
  currentRecoverPasswordId: string | null;
  error: HttpErrorResponse | null;
  status: StateStatus | null;
}

export const recoverPasswordActions = createActionGroup({
  source: 'Recover Password',
  events: {
    Enter: emptyProps(),
    'Select Recover Password': props<{ recover: string }>()
  }
});

export const recoverPasswordApiActions = createActionGroup({
  source: 'Recover Password Api',
  events: {
    Enter: emptyProps(),
    'Password Recovered': props<{
      recover: string;
    }>(),
    'Password Recovered Load Failure': props<{
      error: HttpErrorResponse;
    }>(),
    'Password Recovered Loaded Success': props<{
      member: string;
    }>()
  }
});
