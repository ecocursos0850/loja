import { MessageModel } from '@shared/models/interface/message.interface';

import {
  createFeature,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';

import { MessageAction } from '../actions/message.actions';

export const initialState: MessageModel = {
  severity: '',
  detail: ''
};

export const messageFeatureReducer = createFeature({
  name: 'message',
  reducer: createReducer(
    initialState,
    on(MessageAction.enter, state => {
      return {
        ...state
      };
    }),
    on(MessageAction.sendMessage, (state, { message }) => ({
      ...message
    }))
  )
});

export const MessageSelector = createSelector(
  createFeatureSelector('message'),
  (state: MessageModel) => state
);
