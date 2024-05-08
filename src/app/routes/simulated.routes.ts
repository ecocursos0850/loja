import { Routes } from '@angular/router';

import { QuestionaryComponent } from '../features/components/Questionary';
import { CategoriesChoiceComponent } from '../features/components/Categories';
import { SimulatedPageComponent } from '../features/pages/Simulated';

// TODO Check routes
export const simulatedRoutes: Routes = [
  {
    path: '',
    component: SimulatedPageComponent,
    children: [
      {
        path: '',
        component: CategoriesChoiceComponent
      },
      {
        path: 'questionario',
        component: QuestionaryComponent
      }
    ]
  }
];
