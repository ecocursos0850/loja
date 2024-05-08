import {
  createFeature,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';

import { ModalAction, ModalState } from '../actions/modal.actions';

export const initialState: ModalState = {
  open: null,
  close: false,
  status: null
};

export const modalFeatureReducer = createFeature({
  name: 'modal',
  reducer: createReducer(
    initialState,
    on(ModalAction.enter, state => {
      return {
        open: null,
        close: false,
        status: null
      };
    }),
    on(ModalAction.open, (state, action) => ({
      ...state,
      open: action.modal,
      close: false
    })),
    on(ModalAction.status, (state, action) => ({
      ...state,
      status: action.status,
      close: false
    })),
    on(ModalAction.close, state => ({
      ...state,
      open: null,
      close: true
    }))
  )
});

export const ModalSelector = createSelector(
  createFeatureSelector('modal'),
  (state: ModalState) => state
);

export const ModalPageSelector = createSelector(
  createFeatureSelector('modal'),
  (state: ModalState) => state.open?.page
);
