import { CartType } from '@shared/models/classes/cart-market.model';

import { createActionGroup, emptyProps, props } from '@ngrx/store';

export interface CartState {
  collection: CartType[];
  currentProductId: string | number | null;
  numberOfItems: number;
  error: string | null;
}

export const CartActions = createActionGroup({
  source: 'Cart',
  events: {
    Enter: emptyProps(),
    'Add Item To Cart': props<{ item: CartType }>(),
    'Remove Item To Cart': props<{ item: CartType }>(),
    'Clear All Items To Cart': emptyProps()
  }
});

export const CartApiActions = createActionGroup({
  source: 'Cart Api',
  events: {
    'Cart Loaded Failed': props<{ error: string }>(),
    'cart Loaded Success': props<{
      cart: CartType[];
    }>()
  }
});
