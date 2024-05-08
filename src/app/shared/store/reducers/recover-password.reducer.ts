import {
  recoverPasswordActions,
  RecoverPasswordState
} from '@shared/store/actions/recover-password.actions';

import {
  createFeature,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';

const initialState: RecoverPasswordState = {
  collection: '',
  currentRecoverPasswordId: null,
  error: null,
  status: null
};

export const recoverPasswordFeatureKey = 'recoverPassword';
export const recoverPasswordFeatureReducer = createFeature({
  name: 'recoverPassword',
  reducer: createReducer(
    initialState,
    on(
      recoverPasswordActions.enter,
      recoverPasswordActions.selectRecoverPassword,
      state => {
        return {
          ...state,
          currentCategoryID: null
        };
      }
    )
  )
});

export const recoverPasswordSelector = createSelector(
  createFeatureSelector(recoverPasswordFeatureKey),
  (state: RecoverPasswordState) => state
);
