import { HttpErrorResponse } from '@angular/common/http';

import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { CreateSimulateRequireProps } from '../../models/interface/simulate.interface';

export interface CreateSimulatedState {
  collection: CreateSimulateRequireProps[];
  currentMember: number | null;
  error: HttpErrorResponse | null;
}

export const CreateSimulatedActions = createActionGroup({
  source: 'Simulated',
  events: {
    enter: emptyProps,
    createSimulate: props<{ simulate: CreateSimulateRequireProps }>()
  }
});

export const SimulateCreatedApiActions = createActionGroup({
  source: 'Simulated created Api',
  events: {
    enter: emptyProps,
    'Simulate Created': props<{ simulate: CreateSimulateRequireProps }>(),
    'Simulate Created Faillure': props<{ error: HttpErrorResponse }>(),
    'Simulate Created Loaded Success': props<{
      simulate: CreateSimulateRequireProps[];
    }>()
  }
});
