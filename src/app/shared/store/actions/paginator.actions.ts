import { PaginatorType } from '@shared/models/interface/paginator.interface';

import { createActionGroup, emptyProps, props } from '@ngrx/store';

export interface PaginatorState {
  pageType: PaginatorType;
}

export const PaginatorActions = createActionGroup({
  source: 'Paginator',
  events: {
    Enter: emptyProps(),
    'Select Paginator': props<{ page: PaginatorType }>()
  }
});

// export const PaginatorApiActions = createActionGroup({
//   source: 'Courses Api',
//   events: {
//     'Course Loaded Failed': props<{ error: HttpErrorResponse }>(),
//     'Course Loaded Success': props<{
//       courses: CourseType[];
//     }>(),
//   }
// });
