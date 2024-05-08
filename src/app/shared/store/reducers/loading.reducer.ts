import {
  LoadingAction,
  LoadingState
} from '@shared/store/actions/loading.actions';

import {
  createFeature,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';

export const initialState: LoadingState = {
  isLoading: false
};

export const loadingFeatureReducer = createFeature({
  name: 'loading',
  reducer: createReducer(
    initialState,
    on(LoadingAction.enter, state => {
      return {
        ...state
      };
    }),
    on(LoadingAction.loading, (state, action) => ({
      ...state,
      isLoading: action.message
    }))
  )
});

export const LoadingSelector = createSelector(
  createFeatureSelector('loading'),
  (state: LoadingState) => state
);
