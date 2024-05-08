import {
  createFeature,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';

import {
  TicketActions,
  TicketApiActions,
  TicketState
} from '../actions/ticket.actions';

const initialState: TicketState = {
  response: null,
  currentTicketSend: null,
  totalPayment: 0,
  error: null
};

export const ticketFeatureKey = 'ticket';
export const ticketFeatureReducer = createFeature({
  name: 'ticket',
  reducer: createReducer(
    initialState,
    on(TicketActions.enter, state => {
      return {
        ...state
      };
    }),
    on(TicketActions.selectTicket, (state, action) => {
      return {
        ...state,
        currentTicketSend: action.ticket,
        error: null
      };
    }),
    on(TicketActions.selectTotalPayment, (state, action) => {
      return {
        ...state,
        totalPayment: action.total,
        error: null
      };
    }),

    on(TicketApiActions.ticketLoadedSuccess, (state, action) => {
      return {
        ...state,
        response: action.ticket,
        error: null
      };
    }),
    on(TicketApiActions.ticketLoadedFailed, (state, action) => {
      return {
        ...state,
        response: null,
        error: action.error
      };
    })
  )
});

export const ticketSelect = createSelector(
  createFeatureSelector(ticketFeatureKey),
  (state: TicketState) => state.response
);
export const ticketTotalPaymentSelect = createSelector(
  createFeatureSelector(ticketFeatureKey),
  (state: TicketState) => state.totalPayment
);
export const ticketSelectError = createSelector(
  createFeatureSelector(ticketFeatureKey),
  (state: TicketState) => state.error
);
