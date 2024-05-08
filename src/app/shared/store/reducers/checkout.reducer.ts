import {
  createFeature,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';

import {
  CheckoutActions,
  CheckoutApiActions,
  CheckoutState
} from '../actions/checkout.actions';

const initialState: CheckoutState = {
  response: null,
  currentCheckoutSend: null,
  totalPayment: 0,
  error: null
};

export const checkoutFeatureKey = 'checkout';
export const checkoutFeatureReducer = createFeature({
  name: 'checkout',
  reducer: createReducer(
    initialState,
    on(CheckoutActions.enter, state => {
      return {
        ...state
      };
    }),
    on(CheckoutActions.selectCheckout, (state, action) => {
      return {
        ...state,
        currentCheckoutSend: action.checkout,
        error: null
      };
    }),
    on(CheckoutActions.selectTotalPayment, (state, action) => {
      return {
        ...state,
        totalPayment: action.total,
        error: null
      };
    }),

    on(CheckoutApiActions.checkoutLoadedSuccess, (state, action) => {
      return {
        ...state,
        response: action.checkout,
        error: null
      };
    }),
    on(CheckoutApiActions.checkoutLoadedFailed, (state, action) => {
      return {
        ...state,
        response: null,
        error: action.error
      };
    })
  )
});

export const checkoutSelect = createSelector(
  createFeatureSelector(checkoutFeatureKey),
  (state: CheckoutState) => state.response
);
export const checkoutTotalPaymentSelect = createSelector(
  createFeatureSelector(checkoutFeatureKey),
  (state: CheckoutState) => state.totalPayment
);
export const checkoutSelectError = createSelector(
  createFeatureSelector(checkoutFeatureKey),
  (state: CheckoutState) => state.error
);
