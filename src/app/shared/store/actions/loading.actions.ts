import { createActionGroup, emptyProps, props } from '@ngrx/store';

export interface LoadingState {
  isLoading: boolean;
}

export const LoadingAction = createActionGroup({
  source: 'Loading',
  events: {
    Enter: emptyProps(),
    Loading: props<{ message: boolean }>()
  }
});
