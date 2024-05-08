import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ibgeFeatureReducer } from '@shared/store/reducers/ibge.reducer';
import { loginFeatureReducer } from '@shared/store/reducers/auth.reducer';
import { loadingFeatureReducer } from '@shared/store/reducers/loading.reducer';
import { coursesFeatureReducer } from '@shared/store/reducers/courses.reducer';
import { cartFeatureReducer } from '@shared/store/reducers/cart.reducer';
import { discountCouponFeatureReducer } from '@shared/store/reducers/discount-coupon.reducer';
import { cardNavigationReducer } from '@shared/store/reducers/card-navigation.reducer';

import { provideState } from '@ngrx/store';

import { createSimulatedFeature } from './simulated.reducer';
import { categoriesFeatureReducer } from './categories.reducer';
import { messageFeatureReducer } from './message.reducer';
import { simulatedFromCategoriesFeatureReducer } from './simulatedFromCategories.reducer';
import { userDetailsFeatureReducer } from './user-details.reducer';
import { certificateFeatureReducer } from './certificate.reducer';
import { orderFeatureReducer } from './order.reducer';
import { checkoutFeatureReducer } from './checkout.reducer';
import { ticketFeatureReducer } from './ticket.reducer';
import { modalFeatureReducer } from './modal.reducer';
import { paginatorFeatureReducer } from './paginator.reducer';

export const providerFeatures = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideState(createSimulatedFeature),
    provideState(categoriesFeatureReducer),
    provideState(messageFeatureReducer),
    provideState(simulatedFromCategoriesFeatureReducer),
    provideState(ibgeFeatureReducer),
    provideState(loginFeatureReducer),
    provideState(loadingFeatureReducer),
    provideState(coursesFeatureReducer),
    provideState(cartFeatureReducer),
    provideState(discountCouponFeatureReducer),
    provideState(cardNavigationReducer),
    provideState(certificateFeatureReducer),
    provideState(userDetailsFeatureReducer),
    provideState(orderFeatureReducer),
    provideState(checkoutFeatureReducer),
    provideState(ticketFeatureReducer),
    provideState(modalFeatureReducer),
    provideState(paginatorFeatureReducer)
  ]);
};
