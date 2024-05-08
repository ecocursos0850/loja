import {
  LoginActions,
  LoginApiActions,
  LoginState
} from '@shared/store/actions/auth.actions';

import {
  createFeature,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';

const initialState: LoginState = {
  gettingStatus: true,
  user: null,
  error: null
};

export const loginFeatureKey = 'login';
export const loginFeatureReducer = createFeature({
  name: 'login',
  reducer: createReducer(
    initialState,
    on(LoginActions.enter, state => {
      return {
        ...state
      };
    }),
    on(LoginActions.logout, state => {
      return {
        ...state,
        user: null,
        gettingStatus: true
      };
    }),
    on(LoginActions.login, (state, action) => {
      return {
        ...state,
        user: action.user,
        gettingStatus: true
      };
    }),
    on(LoginApiActions.getLoginStatusSuccess, (state, action) => ({
      gettingStatus: false,
      user: action.user,
      error: null
    })),
    on(LoginApiActions.loginSuccess, (state, action) => {
      return {
        ...state,
        user: action.user,
        gettingStatus: false,
        error: null
      };
    }),
    on(LoginApiActions.loginFailure, (state, action) => {
      return {
        ...state,
        user: null,
        gettingStatus: false,
        error: action.error
      };
    })
  )
});

export const loginSelectUser = createSelector(
  createFeatureSelector(loginFeatureKey),
  (state: LoginState) => state.user
);
export const loginSelectGettingStatus = createSelector(
  createFeatureSelector(loginFeatureKey),
  (state: LoginState) => state.gettingStatus
);
export const loginSelectError = createSelector(
  createFeatureSelector(loginFeatureKey),
  (state: LoginState) => state.error
);
