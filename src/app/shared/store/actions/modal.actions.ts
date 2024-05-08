import { Type } from '@angular/core';

import { createActionGroup, emptyProps, props } from '@ngrx/store';

export class ModalType {
  state: boolean;
  component?: Type<any>;
  page?: 'ticket' | 'credit-card';
}

export interface ModalState {
  open: ModalType | null;
  close: boolean;
  status: 'success' | 'fail' | null;
}

export const ModalAction = createActionGroup({
  source: 'Modal',
  events: {
    Enter: emptyProps(),
    Open: props<{ modal: ModalType }>(),
    Status: props<{ status: 'success' | 'fail' | null }>(),
    Close: emptyProps()
  }
});
