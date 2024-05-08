import { HttpErrorResponse } from '@angular/common/http';
import { CourseType } from '@shared/models/interface/course.interface';
import { PaginatorModel } from '@shared/models/classes/paginator.model';

import { createActionGroup, emptyProps, props } from '@ngrx/store';

export interface CoursesState {
  collection: CourseType[];
  collectionPaginator: CourseType[];
  filteredCourse: CourseType[];
  courseItem: CourseType | null;
  page: PaginatorModel;
  currentCourseById: string | number | null;
  error: HttpErrorResponse | null;
}

export const CoursesActions = createActionGroup({
  source: 'Courses',
  events: {
    Enter: emptyProps(),
    'Select Course': props<{ id: string | number }>(),
    'Select Course By Id': props<{ id: string | number }>(),
    'Search Course': props<{ search: string }>(),
    'Select Course By Category': props<{ id: number | string }>(),
    'Select Course By SubCategory': props<{ id: number | string }>(),
    'Select Page By Paginator': props<{ page: PaginatorModel }>(),
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
    'Course Loaded By Id Success': props<{
      course: CourseType;
    }>(),
    'Course Filtered By Search Success': props<{
      courses: CourseType[];
    }>(),
    'Course Filtered By Category Success': props<{
      courses: CourseType[];
    }>(),
    'Course Filtered By SubCategory Success': props<{
      courses: CourseType[];
    }>(),
    'Course Filtered By Paginator Success': props<{
      courses: CourseType[];
    }>()
  }
});
