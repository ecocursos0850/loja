import { HttpErrorResponse } from '@angular/common/http';
import { UserDetailsModel } from '@shared/models/classes/user-details.model';

import { createActionGroup, emptyProps, props } from '@ngrx/store';

export interface UserDetailsState {
  userDetails: UserDetailsModel[];
  user: string | null;
  error: HttpErrorResponse | null;
}

export const UserDetailsActions = createActionGroup({
  source: 'Login',
  events: {
    Enter: emptyProps(),
    User: props<{ email: string }>(),
    Clear: emptyProps()
  }
});

export const UserDetailsApiActions = createActionGroup({
  source: 'User Details Api',
  events: {
    Enter: emptyProps(),
    'User Details Success': props<{
      user: UserDetailsModel[];
    }>(),
    'User Details Failure': props<{
      error: HttpErrorResponse | null;
    }>(),
    'Clear Failure': props<{
      error: HttpErrorResponse;
    }>(),
    'Clear Success': props<{
      user: [];
    }>()
  }
});
