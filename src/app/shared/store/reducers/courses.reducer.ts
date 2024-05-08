import {
  CoursesActions,
  CoursesApiActions,
  CoursesState
} from '@shared/store/actions/courses.actions';

import {
  createFeature,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';

const paginatorReset = {
  first: 0,
  rows: 6,
  page: 0,
  pageCount: 0
};

const initialState: CoursesState = {
  collection: [],
  currentCourseById: null,
  collectionPaginator: [],
  courseItem: null,
  page: paginatorReset,
  filteredCourse: [],
  error: null
};

export const courseFeatureKey = 'courses';
export const coursesFeatureReducer = createFeature({
  name: 'courses',
  reducer: createReducer(
    initialState,
    on(CoursesActions.enter, CoursesActions.selectCourse, state => {
      return {
        ...state,
        currentCourseId: null,
        filteredCourse: [],
        collectionPaginator: [],
        page: paginatorReset
      };
    }),
    on(CoursesActions.selectCourse, (state, action) => {
      return {
        ...state,
        currentCourseId: action.id,
        page: paginatorReset
      };
    }),
    on(CoursesActions.searchCourse, (state, action) => {
      return {
        ...state,
        currentCourseId: action.search,
        page: paginatorReset
      };
    }),
    on(CoursesActions.selectCourseByCategory, (state, action) => {
      return {
        ...state,
        currentCourseId: action.id,
        page: paginatorReset
      };
    }),
    on(CoursesActions.selectCourseBySubCategory, (state, action) => {
      return {
        ...state,
        currentCourseId: action.id,
        page: paginatorReset
      };
    }),
    on(CoursesActions.selectPageByPaginator, (state, action) => {
      return {
        ...state,
        page: action.page
      };
    }),
    on(CoursesActions.clearSearchCourse, () => initialState),
    on(CoursesApiActions.courseLoadedSuccess, (state, action) => {
      return {
        ...state,
        collection: action.courses,
        error: null,
        page: paginatorReset
      };
    }),
    on(CoursesApiActions.courseFilteredBySearchSuccess, (state, action) => {
      return {
        ...state,
        filteredCourse: action.courses,
        error: null,
        page: paginatorReset
      };
    }),
    on(CoursesApiActions.courseFilteredByCategorySuccess, (state, action) => {
      return {
        ...state,
        collectionPaginator: action.courses,
        error: null,
        page: paginatorReset
      };
    }),
    on(
      CoursesApiActions.courseFilteredBySubCategorySuccess,
      (state, action) => {
        return {
          ...state,
          collectionPaginator: action.courses,
          error: null,
          page: paginatorReset
        };
      }
    ),
    on(CoursesApiActions.courseLoadedByIdSuccess, (state, action) => {
      return {
        ...state,
        courseItem: action.course,
        error: null,
        page: paginatorReset
      };
    }),
    on(CoursesApiActions.courseFilteredByPaginatorSuccess, (state, action) => {
      return {
        ...state,
        collectionPaginator: action.courses,
        error: null,
        page: paginatorReset
      };
    })
  )
});

export const coursesSelector = createSelector(
  createFeatureSelector(courseFeatureKey),
  (state: CoursesState) => state
);

// Pagination selectors
export const coursesCurrentPageSelector = createSelector(
  createFeatureSelector(courseFeatureKey),
  (state: CoursesState) => state.page.page
);

export const coursesRowsPageSelector = createSelector(
  createFeatureSelector(courseFeatureKey),
  (state: CoursesState) => state.page.rows
);

export const coursesPaginatorWithFilterSelector = createSelector(
  coursesSelector,
  coursesCurrentPageSelector,
  coursesRowsPageSelector,
  (data, currentPage, rowsPage) => {
    const startIndex = currentPage * rowsPage;
    const endIndex = startIndex + rowsPage;
    return data.collectionPaginator.slice(startIndex, endIndex);
  }
);

export const coursesPaginatorAllItemsSelector = createSelector(
  coursesSelector,
  coursesCurrentPageSelector,
  coursesRowsPageSelector,
  (data, currentPage, rowsPage) => {
    const startIndex = currentPage * rowsPage;
    const endIndex = startIndex + rowsPage;
    return data.collection.slice(startIndex, endIndex);
  }
);

export const coursesPaginatorSearchItemsSelector = createSelector(
  coursesSelector,
  coursesCurrentPageSelector,
  coursesRowsPageSelector,
  (data, currentPage, rowsPage) => {
    const startIndex = currentPage * rowsPage;
    const endIndex = startIndex + rowsPage;
    return data.filteredCourse.slice(startIndex, endIndex);
  }
);

// **

export const coursesItemSelector = createSelector(
  createFeatureSelector(courseFeatureKey),
  (state: CoursesState) => state.courseItem
);

export const courseSelectorCollection = createSelector(
  coursesSelector,
  state => state.collection
);

export const courseSelectorCollectionLength = createSelector(
  coursesSelector,
  state => state.collection.length
);

export const courseSelectorPaginatorCollectionLength = createSelector(
  coursesSelector,
  state => state.collectionPaginator.length
);

// export const courseSelectorCollectionPaginator = createSelector(
//   coursesSelector,
//   state => state.collectionPaginator
// );
