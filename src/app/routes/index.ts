import { Route } from '@angular/router';

import { LandingPageComponent } from '../features/pages/LandingPage';
import { LoginPageComponent } from '../features/components/Login';
import { RegisterPageComponent } from '../features/components/Register';
import { RecoverPasswordPageComponent } from '../features/pages/RecoverPassword';

export const routes: Route[] = [
  { path: '', component: LandingPageComponent },
  {
    path: 'simulados',
    loadChildren: () =>
      import('./simulated.routes').then(r => r.simulatedRoutes)
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'cadastro',
    component: RegisterPageComponent
  },
  {
    path: 'recuperar-senha',
    component: RecoverPasswordPageComponent
  },
  {
    path: 'categorias',
    loadChildren: () =>
      import('./categories-course.routes').then(r => r.categoriesCourseRoutes)
  },
  {
    path: 'cursos',
    loadChildren: () =>
      import('./course-details.routes').then(r => r.courseDetailsRoutes)
  },
  {
    path: 'carrinho-de-compras',
    loadChildren: () =>
      import('./cart-market.routes').then(r => r.cartMarketRoutes)
  }
];
