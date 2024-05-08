import {
  IbgeInformationActions,
  IbgeInformationApiActions,
  IbgeInformationState
} from '@shared/store/actions/cep-information.actions';
import { IbgeInterfaceModel } from '@shared/models/classes/ibge.interface.model';

import {
  createFeature,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';

const initialState: IbgeInformationState = {
  collection: new IbgeInterfaceModel(),
  currentCategoryId: null,
  error: null
};

export const ibgeFeatureKey = 'ibge';
export const ibgeFeatureReducer = createFeature({
  name: 'ibge',
  reducer: createReducer(
    initialState,
    on(
      IbgeInformationActions.enter,
      IbgeInformationActions.selectIbgeInfor,
      state => {
        return {
          ...state,
          currentCategoryID: null
        };
      }
    ),
    on(IbgeInformationActions.selectIbgeInfor, (state, action) => {
      return {
        ...state,
        currentCategoryId: action.value
      };
    }),
    on(IbgeInformationApiActions.ibgeLoadedSuccess, (state, action) => {
      return {
        ...state,
        collection: action.information,
        error: null
      };
    })
  )
});

export const ibgeInformationSelector = createSelector(
  createFeatureSelector(ibgeFeatureKey),
  (state: IbgeInformationState) => state.collection
);
