import { Routes } from '@angular/router';

import { CoursesPageComponent } from '../features/pages/Courses';

export const coursesRoutes: Routes = [
  {
    path: 'ecoClub',
    component: CoursesPageComponent
  },
  {
    path: 'direitoOnline',
    component: CoursesPageComponent
  },
  {
    path: 'profissionalizantes',
    component: CoursesPageComponent
  },
  {
    path: 'concursos-exame-da-oab',
    component: CoursesPageComponent
  }
];
