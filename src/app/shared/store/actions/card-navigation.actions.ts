import { createActionGroup, emptyProps, props } from '@ngrx/store';

export interface CardNavigationState {
  currentPage: string;
  error: Error | null;
}

export const CardNavigationActions = createActionGroup({
  source: 'CardNavigation',
  events: {
    Enter: emptyProps(),
    'Select Page': props<{ page: string }>()
  }
});
