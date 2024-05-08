import {
  createFeature,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';

import {
  CreateSimulatedActions,
  CreateSimulatedState
} from '../actions/simulated.actions';
import { CreateSimulateRequireProps } from '../../models/interface/simulate.interface';

const createSimulated = (
  simulations: CreateSimulateRequireProps[],
  simulated: CreateSimulateRequireProps
): CreateSimulateRequireProps[] => {
  return [...simulations, simulated];
};

export const initialState: CreateSimulatedState = {
  collection: [],
  currentMember: null,
  error: null
};

export const createSimulatedFeatureKey = 'simulated';
export const createSimulatedFeature = createFeature({
  name: 'simulated',
  reducer: createReducer(
    initialState,
    on(CreateSimulatedActions.enter, state => {
      return {
        ...state,
        currentMember: null,
        error: null
      };
    }),
    on(CreateSimulatedActions.createSimulate, (state, action) => {
      return {
        ...state,
        collection: createSimulated(state.collection, action.simulate)
      };
    })
  )
});

export const createSimulatedSelector = createSelector(
  createFeatureSelector(createSimulatedFeatureKey),
  (state: CreateSimulatedState) => state
);
