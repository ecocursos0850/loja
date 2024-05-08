import {
  CartActions,
  CartApiActions,
  CartState
} from '@shared/store/actions/cart.actions';
import { CartType } from '@shared/models/classes/cart-market.model';

import {
  createFeature,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';

const initialState: CartState = {
  collection: [],
  currentProductId: null,
  numberOfItems: 0,
  error: null
};

const addItemToCart = (
  simulations: CartType[],
  simulated: CartType
): CartType[] => {
  return [...simulations, simulated];
};

export const cartFeatureKey = 'cart';
export const cartFeatureReducer = createFeature({
  name: 'cart',
  reducer: createReducer(
    initialState,
    on(CartActions.enter, state => {
      return {
        ...state,
        currentProductId: null
      };
    }),
    on(CartActions.addItemToCart, (state, action) => {
      return {
        ...state,
        collection: addItemToCart(state.collection, action.item)
      };
    }),
    on(CartActions.removeItemToCart, (state, action) => {
      const collection = [
        ...state.collection.filter(item => item.id !== action.item.id)
      ];

      return {
        ...state,
        collection: collection
      };
    }),
    on(CartActions.clearAllItemsToCart, state => {
      return {
        ...state,
        collection: [],
        currentProductId: null
      };
    }),
    on(CartApiActions.cartLoadedSuccess, (state, action) => {
      return {
        ...state,
        collection: action.cart,
        error: null
      };
    }),
    on(CartApiActions.cartLoadedFailed, (state, action) => {
      return {
        ...state,
        collection: [],
        error: action.error
      };
    })
  )
});

export const cartSelector = createSelector(
  createFeatureSelector(cartFeatureKey),
  (state: CartState) => state
);

export const cartTotalItemsSelector = createSelector(cartSelector, state => {
  return state.collection.length;
});

export const cartItemsSelector = createSelector(cartSelector, state => {
  return state.collection;
});

export const cartTotalPriceSelector = createSelector(
  cartItemsSelector,
  state => {
    return state.reduce(
      (accumulator: number, cartItem: CartType) => accumulator + cartItem.preco,
      0
    );
  }
);

export const cartTotalHoursSelector = createSelector(
  cartItemsSelector,
  state => {
    return state.reduce(
      (accumulator: number, cartItem: CartType) =>
        accumulator + cartItem.cargaHoraria,
      0
    );
  }
);
