import { Routes } from '@angular/router';
import { LayoutComponent } from '@shared/components/Layout';

import { CoursesPageComponent } from '../features/pages/Courses';

export const categoriesCourseRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: CoursesPageComponent
      }
    ]
  }
];
