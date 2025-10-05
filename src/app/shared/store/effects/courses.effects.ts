import { inject, Injectable } from '@angular/core';
import { CourseService } from '@shared/services/courses.service';
import {
  CoursesActions,
  CoursesApiActions
} from '@shared/store/actions/courses.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { CourseType } from '@shared/models/interface/course.interface';
import { MessageAction } from '@shared/store/actions/message.actions';
import { LoadingAction } from '@shared/store/actions/loading.actions';

import { catchError, from, map, of, switchMap, tap } from 'rxjs';

import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

@Injectable()
export class CoursesEffect {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private courseService = inject(CourseService);

  getAllCourses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.enter),
      switchMap(() =>
        from(
          this.courseService.getAllCourses().pipe(
            map((courseData: CourseType[]) => {
              return CoursesApiActions.courseLoadedSuccess({
                courses: courseData
              });
            }),
            tap(() => {
              this.store.dispatch(LoadingAction.loading({ message: false }));
            }),
            catchError((err: HttpErrorResponse) => {
              this.store.dispatch(LoadingAction.loading({ message: false }));
              this.store.dispatch(
                MessageAction.sendMessage({
                  message: {
                    severity: 'Error',
                    detail: `Erro ao tentar carregar cursos`
                  }
                })
              );
              return of(CoursesApiActions.courseLoadedFailed({ error: err }));
            })
          )
        )
      )
    )
  );

  getCourseById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.selectCourseById),
      switchMap(({ id }) =>
        from(
          this.courseService.getCourseById(id).pipe(
            map((courseData: CourseType) => {
              return CoursesApiActions.courseLoadedByIdSuccess({
                course: courseData
              });
            }),
            tap(() => {
              this.store.dispatch(LoadingAction.loading({ message: false }));
            }),
            catchError((err: HttpErrorResponse) => {
              this.store.dispatch(LoadingAction.loading({ message: false }));
              this.store.dispatch(
                MessageAction.sendMessage({
                  message: {
                    severity: 'Error',
                    detail: `Erro ao tentar carregar cursos`
                  }
                })
              );
              return of(CoursesApiActions.courseLoadedFailed({ error: err }));
            })
          )
        )
      )
    )
  );

  searchCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.searchCourse),
      switchMap(({ search }) =>
        from(
          this.courseService.searchCourse(search).pipe(
            map((courseData: CourseType[]) => {
              return CoursesApiActions.courseFilteredBySearchSuccess({
                courses: courseData
              });
            }),
            tap(() => {
              this.store.dispatch(LoadingAction.loading({ message: false }));
            }),
            catchError((err: HttpErrorResponse) => {
              this.store.dispatch(LoadingAction.loading({ message: false }));
              this.store.dispatch(
                MessageAction.sendMessage({
                  message: {
                    severity: 'Error',
                    detail: `Erro ao tentar carregar cursos`
                  }
                })
              );
              return of(CoursesApiActions.courseLoadedFailed({ error: err }));
            })
          )
        )
      )
    )
  );

  filterCourseByCategoryID$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.selectCourseByCategory),
      switchMap(({ id }) =>
        from(
          this.courseService.getCourseByCategory(id).pipe(
            map((courseData: CourseType[]) => {
              return CoursesApiActions.courseFilteredByCategorySuccess({
                courses: courseData
              });
            }),
            tap(() => {
              this.store.dispatch(LoadingAction.loading({ message: false }));
            }),
            catchError((err: HttpErrorResponse) => {
              this.store.dispatch(LoadingAction.loading({ message: false }));
              this.store.dispatch(
                MessageAction.sendMessage({
                  message: {
                    severity: 'Error',
                    detail: `Erro ao tentar carregar cursos`
                  }
                })
              );
              return of(CoursesApiActions.courseLoadedFailed({ error: err }));
            })
          )
        )
      )
    )
  );

  filterCourseBySubCategoryID$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.selectCourseBySubCategory),
      switchMap(({ id }) =>
        from(
          this.courseService.getCourseBySubCategory(id).pipe(
            map((courseData: CourseType[]) => {
              return CoursesApiActions.courseFilteredBySubCategorySuccess({
                courses: courseData
              });
            }),
            tap(() => {
              this.store.dispatch(LoadingAction.loading({ message: false }));
            }),
            catchError((err: HttpErrorResponse) => {
              this.store.dispatch(LoadingAction.loading({ message: false }));
              this.store.dispatch(
                MessageAction.sendMessage({
                  message: {
                    severity: 'Error',
                    detail: `Erro ao tentar carregar cursos`
                  }
                })
              );
              return of(CoursesApiActions.courseLoadedFailed({ error: err }));
            })
          )
        )
      )
    )
  );
}
