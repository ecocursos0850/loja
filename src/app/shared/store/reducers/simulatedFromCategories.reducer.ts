import {
  createFeature,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';

import { CategoriesActions } from '../actions/categories.actions';
import {
  SimulatedFromCategoriesActions,
  SimulatedFromCategoriesApiActions,
  SimulatedFromCategoriesState
} from '../actions/simulatedFromCategories.actions';

const initialState: SimulatedFromCategoriesState = {
  collection: [],
  currentCategoryId: null,
  error: null
};

export const simulatedFromCategoriesFeatureKey = 'simulatedFromCategories';
export const simulatedFromCategoriesFeatureReducer = createFeature({
  name: 'simulatedFromCategories',
  reducer: createReducer(
    initialState,
    on(
      SimulatedFromCategoriesActions.enter,
      CategoriesActions.selectCategory,
      state => {
        return {
          ...state,
          currentCategoryID: null
        };
      }
    ),
    on(
      SimulatedFromCategoriesApiActions.simulatedFromCategoriesLoadedSuccess,
      (state, action) => {
        return {
          ...state,
          collection: action.categories,
          error: null
        };
      }
    )
  )
});

export const selectAll = (state: SimulatedFromCategoriesState) =>
  state.collection;
export const selectActiveCategoryId = (state: SimulatedFromCategoriesState) =>
  state.currentCategoryId;

export const selectActiveSimulatedFromCategories = createSelector(
  selectAll,
  selectActiveCategoryId,
  (categories, activeCategoryId) =>
    categories.find(cat => cat.id === activeCategoryId)
);

export const simulatedCategoriessSelector = createSelector(
  createFeatureSelector(simulatedFromCategoriesFeatureKey),
  (state: SimulatedFromCategoriesState) =>
    state.collection.map(res => res.categoriaSimulado)
);

export const simulatedFromCategoriessSelector = createSelector(
  createFeatureSelector(simulatedFromCategoriesFeatureKey),
  (state: SimulatedFromCategoriesState) => state
);

export const simulatedFromCategoriessSelectoCollection = createSelector(
  createFeatureSelector(simulatedFromCategoriesFeatureKey),
  (state: SimulatedFromCategoriesState) => state.collection
);
