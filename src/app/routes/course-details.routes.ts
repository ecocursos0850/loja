import { Routes } from '@angular/router';
import { LayoutComponent } from '@shared/components/Layout';

import { CardDetailsPageComponent } from '../features/components/CardDetails';

export const courseDetailsRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: ':title/:code',
        component: CardDetailsPageComponent
      }
    ]
  }
];
