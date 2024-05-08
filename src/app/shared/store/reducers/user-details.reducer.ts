import {
  createFeature,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';

import {
  UserDetailsActions,
  UserDetailsApiActions,
  UserDetailsState
} from '../actions/user-details.actions';

const initialState: UserDetailsState = {
  userDetails: [],
  user: null,
  error: null
};

export const userDetailsFeatureKey = 'userDetails';
export const userDetailsFeatureReducer = createFeature({
  name: 'userDetails',
  reducer: createReducer(
    initialState,
    on(UserDetailsActions.enter, state => {
      return {
        ...state
      };
    }),
    on(UserDetailsActions.clear, state => {
      return {
        ...state,
        userDetails: [],
        user: null,
        error: null
      };
    }),
    on(UserDetailsActions.user, (state, action) => {
      return {
        ...state,
        user: action.email,
        error: null
      };
    }),
    on(UserDetailsApiActions.userDetailsSuccess, (state, action) => {
      return {
        ...state,
        userDetails: action.user,
        error: null,
        isLoading: false
      };
    }),
    on(UserDetailsApiActions.userDetailsFailure, (state, action) => {
      return {
        ...state,
        userDetails: [],
        error: action.error
      };
    })
  )
});

export const userDetailsSelect = createSelector(
  createFeatureSelector(userDetailsFeatureKey),
  (state: UserDetailsState) => state.userDetails
);
export const userDetailsNameSelect = createSelector(
  createFeatureSelector(userDetailsFeatureKey),
  (state: UserDetailsState) => {
    let name = '';
    state.userDetails.map(user => {
      name = user.nome;
    });
    return name;
  }
);
export const userDetailsDiscountSelect = createSelector(
  createFeatureSelector(userDetailsFeatureKey),
  (state: UserDetailsState) => {
    let partnerDiscount = '';
    state.userDetails.map(user => {
      partnerDiscount = user.parceiro?.porcentagemDesconto;
    });
    return partnerDiscount ?? 0;
  }
);
export const userDetailsAvailableHoursSelect = createSelector(
  createFeatureSelector(userDetailsFeatureKey),
  (state: UserDetailsState) => {
    let availableHours;
    state.userDetails.map(user => {
      availableHours = user.horasDisponiveis;
    });
    return availableHours;
  }
);
export const userDetailsLoadingSelect = createSelector(
  createFeatureSelector(userDetailsFeatureKey),
  (state: UserDetailsState) => state.userDetails
);

export const userDetailsPartner = createSelector(
  createFeatureSelector(userDetailsFeatureKey),
  (state: UserDetailsState) => {
    let isPartner;
    state.userDetails.map(
      res => (isPartner = res.parceiro?.isParceiro ? true : false)
    );
    return isPartner;
  }
);

export const loginSelectError = createSelector(
  createFeatureSelector(userDetailsFeatureKey),
  (state: UserDetailsState) => state.error
);
