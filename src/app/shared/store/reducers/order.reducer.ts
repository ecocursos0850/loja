import {
  createFeature,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';

import {
  OrderActions,
  OrderApiActions,
  OrderState
} from '../actions/order.actions';

const initialState: OrderState = {
  order: null,
  currentOrderSend: null,
  error: null
};

export const orderFeatureKey = 'order';
export const orderFeatureReducer = createFeature({
  name: 'order',
  reducer: createReducer(
    initialState,
    on(OrderActions.enter, state => {
      return {
        ...state
      };
    }),
    on(OrderActions.selectOrder, (state, action) => {
      return {
        ...state,
        currentOrderSend: action.order,
        error: null
      };
    }),
    on(OrderApiActions.orderLoadedSuccess, (state, action) => {
      return {
        ...state,
        order: action.order,
        error: null
      };
    }),
    on(OrderApiActions.orderLoadedFailed, (state, action) => {
      return {
        ...state,
        order: null,
        error: action.error
      };
    })
  )
});

export const orderSelect = createSelector(
  createFeatureSelector(orderFeatureKey),
  (state: OrderState) => state.order
);
export const orderLinkSelect = createSelector(
  createFeatureSelector(orderFeatureKey),
  (state: OrderState) => state.order
);
export const orderSelectError = createSelector(
  createFeatureSelector(orderFeatureKey),
  (state: OrderState) => state.error
);
