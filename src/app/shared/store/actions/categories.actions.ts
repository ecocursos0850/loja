import { HttpErrorResponse } from '@angular/common/http';

import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { CategoriesRequiredType } from '../../models/interface/categories.interface';

export interface CategoriesState {
  collection: CategoriesRequiredType[];
  currentCategoryId: string | number | null;
  error: HttpErrorResponse | null;
}

export const CategoriesActions = createActionGroup({
  source: 'Categories',
  events: {
    Enter: emptyProps(),
    'Select Category': props<{ id: string | number }>()
  }
});

export const CategoriesApiActions = createActionGroup({
  source: 'Categories Api',
  events: {
    'Categories Loaded Failed': props<{ error: HttpErrorResponse }>(),
    'Categories Loaded Success': props<{
      categories: CategoriesRequiredType[];
    }>()
  }
});
