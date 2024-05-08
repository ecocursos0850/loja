import {
  CardNavigationActions,
  CardNavigationState
} from '@shared/store/actions/card-navigation.actions';

import {
  createFeature,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';

const initialState: CardNavigationState = {
  currentPage: '',
  error: null
};

export const cardNavigationFeatureKey = 'cardNavigation';
export const cardNavigationReducer = createFeature({
  name: 'cardNavigation',
  reducer: createReducer(
    initialState,
    on(CardNavigationActions.selectPage, state => {
      return {
        ...state,
        currentPage: ''
      };
    }),
    on(CardNavigationActions.selectPage, (state, action) => {
      return {
        ...state,
        currentPage: action.page
      };
    })
  )
});

export const cardNavigationSelectCurrentPage = createSelector(
  createFeatureSelector(cardNavigationFeatureKey),
  (state: CardNavigationState) => state.currentPage
);
