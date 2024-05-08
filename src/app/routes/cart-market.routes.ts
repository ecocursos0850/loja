import { Routes } from '@angular/router';

import { CartPageComponent } from '../features/components/CartMarket';
import { PaymentPageComponent } from '../features/pages/Payment';
import { CheckoutPageComponent } from '../features/pages/Checkout';

export const cartMarketRoutes: Routes = [
  {
    path: '',
    component: CheckoutPageComponent,
    children: [
      {
        path: '',
        component: CartPageComponent
      },
      {
        path: 'pagamento/:invoice_id',
        component: PaymentPageComponent
      }
    ]
  }
];
