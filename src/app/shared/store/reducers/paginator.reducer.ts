import {
  createFeature,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';

import { PaginatorActions, PaginatorState } from '../actions/paginator.actions';
import { PaginatorType } from '../../models/interface/paginator.interface';

const initialState: PaginatorState = {
  pageType: new PaginatorType()
};

export const paginatorFeatureKey = 'paginator';
export const paginatorFeatureReducer = createFeature({
  name: 'paginator',
  reducer: createReducer(
    initialState,
    on(PaginatorActions.enter, PaginatorActions.selectPaginator, state => {
      return {
        ...state
      };
    }),
    on(PaginatorActions.selectPaginator, (state, action) => {
      return {
        ...state,
        pageType: action.page
      };
    })
  )
});

// TODO: Remove after
export const paginatorSelector = createSelector(
  createFeatureSelector(paginatorFeatureKey),
  (state: PaginatorState) => state
);

export const paginatorTypeSelector = createSelector(
  createFeatureSelector(paginatorFeatureKey),
  (state: PaginatorState) => state.pageType
);
