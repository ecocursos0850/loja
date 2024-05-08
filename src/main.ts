import { AppComponent } from './app/app.component';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import {
  DEFAULT_CURRENCY_CODE,
  importProvidersFrom,
  isDevMode,
  LOCALE_ID
} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';

import { provideStoreDevtools } from '@ngrx/store-devtools';
import { HttpClientModule } from '@angular/common/http';
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  PreloadAllModules,
  provideRouter,
  withInMemoryScrolling,
  withPreloading
} from '@angular/router';
import { routes } from './app/routes';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { providerFeatures } from '@shared/store/reducers';
import { provideEffects } from '@ngrx/effects';
import { CategoriesEffect } from '@shared/store/effects/categories.effects';
import { SimulatedFromCategoriesByIdEffect } from '@shared/store/effects/simulatedFromCategories.effects';
import { CustomSerializer } from './app/routes/custom-serializer';
import { IbgeEffect } from '@shared/store/effects/ibge.effects';
import { AuthEffect } from '@shared/store/effects/auth.effects';
import { CoursesEffect } from '@shared/store/effects/courses.effects';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { CartEffect } from '@shared/store/effects/cart.effects';
import { DiscountCouponEffect } from '@shared/store/effects/discount-coupon.effects';
import { CertificateEffect } from '@shared/store/effects/certificate.effects';
import { OrderEffect } from '@shared/store/effects/order.effects';
import { CheckoutEffect } from '@shared/store/effects/checkout.effects';
import { TicketEffect } from '@shared/store/effects/ticket.effects';

registerLocaleData(ptBr);

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled'
};

const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule
    ),
    provideStore({ router: routerReducer }),
    provideStoreDevtools({
      name: 'DevTools & Debugging in NgRx',
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
      connectOutsideZone: true
    }),
    providerFeatures(),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      inMemoryScrollingFeature
    ),
    provideRouterStore({
      serializer: CustomSerializer
    }),
    provideEffects(CategoriesEffect),
    provideEffects(SimulatedFromCategoriesByIdEffect),
    provideEffects(IbgeEffect),
    provideEffects(AuthEffect),
    provideEffects(CoursesEffect),
    provideEffects(CartEffect),
    provideEffects(DiscountCouponEffect),
    provideEffects(CertificateEffect),
    provideEffects(OrderEffect),
    provideEffects(CheckoutEffect),
    provideEffects(TicketEffect),
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' }
  ]
});
