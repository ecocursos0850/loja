import { HttpErrorResponse } from '@angular/common/http';
import { DiscountCouponType } from '@shared/models/classes/ticket.interface.model';

import { createActionGroup, emptyProps, props } from '@ngrx/store';

export interface DiscountCouponState {
  collection: DiscountCouponType | null;
  currentDiscountId: string | number | null;
  error: HttpErrorResponse | null;
}

export const DiscountCouponActions = createActionGroup({
  source: 'Discount Coupon Information',
  events: {
    Enter: emptyProps(),
    'Select Coupon': props<{ id: string }>()
  }
});

export const DiscountCouponApiActions = createActionGroup({
  source: 'Discount CouponApi',
  events: {
    'Discount Coupon Loaded Failed': props<{ error: HttpErrorResponse }>(),
    'Discount Coupon Loaded Success': props<{
      coupon: DiscountCouponType;
    }>()
  }
});
