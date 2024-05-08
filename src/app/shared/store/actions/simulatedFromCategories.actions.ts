import { HttpErrorResponse } from '@angular/common/http';

import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { SimulatedFromCategoriesType } from '../../models/interface/simulated-from-categories.interface';

export interface SimulatedFromCategoriesState {
  collection: SimulatedFromCategoriesType[];
  currentCategoryId: string | number | null;
  error: HttpErrorResponse | null;
}

export const SimulatedFromCategoriesActions = createActionGroup({
  source: 'Categories',
  events: {
    Enter: emptyProps(),
    'Select Category': props<{ id: string | number }>()
  }
});

export const SimulatedFromCategoriesApiActions = createActionGroup({
  source: 'Simulated From Categories Api',
  events: {
    'Simulated From Categories loaded Failed': props<{
      error: HttpErrorResponse;
    }>(),
    'Simulated From Categories Loaded Success': props<{
      categories: SimulatedFromCategoriesType[];
    }>()
  }
});
