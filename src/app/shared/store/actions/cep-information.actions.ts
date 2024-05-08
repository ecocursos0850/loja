import { HttpErrorResponse } from '@angular/common/http';
import { IbgeInterfaceModel } from '@shared/models/classes/ibge.interface.model';

import { createActionGroup, emptyProps, props } from '@ngrx/store';

export interface IbgeInformationState {
  collection: IbgeInterfaceModel;
  currentCategoryId: string | number | null;
  error: HttpErrorResponse | null;
}

export const IbgeInformationActions = createActionGroup({
  source: 'Ibge Information',
  events: {
    Enter: emptyProps(),
    'Select Ibge Infor': props<{ value: string }>()
  }
});

export const IbgeInformationApiActions = createActionGroup({
  source: 'Ibge Information Api',
  events: {
    'Ibge Loaded Failed': props<{ error: HttpErrorResponse }>(),
    'ibge Loaded Success': props<{
      information: IbgeInterfaceModel;
    }>()
  }
});
