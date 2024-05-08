import { HttpErrorResponse } from '@angular/common/http';
import { CourseType } from '@shared/models/interface/course.interface';
import { CategoriesTopicsType } from '@shared/models/interface/categoires-topics.interface';

import { createActionGroup, emptyProps, props } from '@ngrx/store';

export interface CategoriesTopicsState {
  collection: CategoriesTopicsType[];
  searchFilter: CourseType[];
  currentCourseId: string | number | null;
  error: HttpErrorResponse | null;
}

export const CoursesActions = createActionGroup({
  source: 'Courses',
  events: {
    Enter: emptyProps(),
    'Select Course': props<{ id: string | number }>(),
    'Search Course': props<{ search: string }>(),
    'Clear Search Course': emptyProps
  }
});

export const CoursesApiActions = createActionGroup({
  source: 'Courses Api',
  events: {
    'Course Loaded Failed': props<{ error: HttpErrorResponse }>(),
    'Course Loaded Success': props<{
      courses: CourseType[];
    }>(),
    'Course Filtered Success': props<{
      courses: CourseType[];
    }>()
  }
});
