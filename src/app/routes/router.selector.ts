import { RouterStateInterface } from '@shared/models/interface/router-state.interface';

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';

export const getRouterState =
  createFeatureSelector<RouterReducerState<RouterStateInterface>>('router');

export const getCurrentRoute = createSelector(getRouterState, router => {
  return router.state;
});
