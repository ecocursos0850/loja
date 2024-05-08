import { HttpErrorResponse } from '@angular/common/http';
import { Certificate } from '@shared/models/interface/certificate.interface';

import { createActionGroup, emptyProps, props } from '@ngrx/store';

export interface CertificateState {
  currentCertificateNumber: string | number | null;
  collection: Certificate | null;
  closeModal: boolean | null;
  error: Error | null;
}

export const CertificateActions = createActionGroup({
  source: 'Certificate',
  events: {
    Enter: emptyProps(),
    'Select Certificate': props<{ uuid: string }>(),
    'Close Modal': emptyProps()
  }
});

export const CertificateApiActions = createActionGroup({
  source: 'Certificate Api',
  events: {
    Enter: emptyProps(),
    'Certificate Success': props<{
      certificate: Certificate;
    }>(),
    'Certificate Failure': props<{
      error: HttpErrorResponse;
    }>()
  }
});
