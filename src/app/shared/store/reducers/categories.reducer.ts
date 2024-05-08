import {
  createFeature,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';

import {
  CategoriesActions,
  CategoriesApiActions,
  CategoriesState
} from '../actions/categories.actions';
import { getCurrentRoute } from '../../../routes/router.selector';
import { RouterStateInterface } from '../../models/interface/router-state.interface';

const initialState: CategoriesState = {
  collection: [],
  currentCategoryId: null,
  error: null
};

export const categoriesFeatureKey = 'categories';
export const categoriesFeatureReducer = createFeature({
  name: 'categories',
  reducer: createReducer(
    initialState,
    on(CategoriesActions.enter, CategoriesActions.selectCategory, state => {
      return {
        ...state,
        currentCategoryID: null
      };
    }),
    on(CategoriesActions.selectCategory, (state, action) => {
      return {
        ...state,
        currentCategoryId: action.id
      };
    }),
    on(CategoriesApiActions.categoriesLoadedSuccess, (state, action) => {
      return {
        ...state,
        collection: action.categories,
        error: null
      };
    })
  )
});

export const selectAll = (state: CategoriesState) => state.collection;
export const selectActiveCategoryId = (state: CategoriesState) =>
  state.currentCategoryId;

export const categoriesSelector = createSelector(
  createFeatureSelector(categoriesFeatureKey),
  (state: CategoriesState) => state
);

const getCategorieById =
  createFeatureSelector<CategoriesState>(categoriesFeatureKey);

export const getCategories = createSelector(getCategorieById, state => {
  return state.collection;
});

export const selectActiveCategory = createSelector(
  getCategories,
  getCurrentRoute,
  (categories, route: RouterStateInterface) => {
    let activeCategoryId: string;

    if (route.params['id']) activeCategoryId = route.params['id'].toString();

    return categories.find(cat => cat.id == activeCategoryId);
  }
);
