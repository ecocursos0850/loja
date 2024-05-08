import { HttpErrorResponse } from '@angular/common/http';
import { OrderModel } from '@shared/models/classes/order.model';
import { OrderAlready } from '@shared/models/interface/oreder-already.interface';

import { createActionGroup, emptyProps, props } from '@ngrx/store';

export interface OrderState {
  order: OrderAlready | null;
  currentOrderSend: OrderModel | null;
  error: HttpErrorResponse | null;
}

export const OrderActions = createActionGroup({
  source: 'Order',
  events: {
    Enter: emptyProps(),
    'Select Order': props<{ order: OrderModel }>()
  }
});

export const OrderApiActions = createActionGroup({
  source: 'Order Api',
  events: {
    'Order Loaded Success': props<{
      order: OrderAlready;
    }>(),
    'Order Loaded Failed': props<{ error: HttpErrorResponse }>()
  }
});
