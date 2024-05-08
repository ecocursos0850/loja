import {
  DiscountCouponActions,
  DiscountCouponApiActions,
  DiscountCouponState
} from '@shared/store/actions/discount-coupon.actions';

import {
  createFeature,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';

const initialState: DiscountCouponState = {
  collection: null,
  currentDiscountId: null,
  error: null
};

export const discountCouponCertificate = 'discountCoupon';
export const discountCouponFeatureReducer = createFeature({
  name: 'discountCoupon',
  reducer: createReducer(
    initialState,
    on(DiscountCouponActions.selectCoupon, (state, action) => {
      return {
        ...state,
        currentDiscountId: action.id
      };
    }),
    on(
      DiscountCouponApiActions.discountCouponLoadedSuccess,
      (state, action) => ({
        ...state,
        collection: action.coupon,
        error: null
      })
    ),
    on(
      DiscountCouponApiActions.discountCouponLoadedFailed,
      (state, action) => ({
        ...state,
        collection: null,
        error: action.error
      })
    )
  )
});

export const discountCouponSelect = createSelector(
  createFeatureSelector(discountCouponCertificate),
  (state: DiscountCouponState) => state.collection
);

export const discountCouponSelectError = createSelector(
  createFeatureSelector(discountCouponCertificate),
  (state: DiscountCouponState) => state.error
);
