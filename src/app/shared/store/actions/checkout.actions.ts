import { HttpErrorResponse } from '@angular/common/http';
import { DirectBillingModel } from '@shared/models/classes/direct-billing.model';

import { createActionGroup, emptyProps, props } from '@ngrx/store';

export interface CheckoutState {
  response: string | null;
  currentCheckoutSend: DirectBillingModel | null;
  totalPayment: number;
  error: HttpErrorResponse | null;
}

export const CheckoutActions = createActionGroup({
  source: 'Checkout',
  events: {
    Enter: emptyProps(),
    'Select Checkout': props<{ checkout: DirectBillingModel }>(),
    'Select Total Payment': props<{ total: number }>()
  }
});

export const CheckoutApiActions = createActionGroup({
  source: 'Checkout Api',
  events: {
    'Checkout Loaded Success': props<{
      checkout: string | null;
    }>(),
    'Checkout Loaded Failed': props<{ error: HttpErrorResponse }>()
  }
});
