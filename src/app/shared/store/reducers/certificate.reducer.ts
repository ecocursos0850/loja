import {
  CertificateApiActions,
  CertificateActions,
  CertificateState
} from '@shared/store/actions/auth-certificate.actions';

import {
  createFeature,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';

const initialState: CertificateState = {
  collection: null,
  currentCertificateNumber: null,
  closeModal: null,
  error: null
};

export const certificate = 'certificate';
export const certificateFeatureReducer = createFeature({
  name: 'certificate',
  reducer: createReducer(
    initialState,
    on(CertificateActions.enter, state => {
      return {
        ...state,
        collection: null,
        closeModal: false
      };
    }),
    on(CertificateActions.closeModal, state => {
      return {
        ...state,
        collection: null,
        closeModal: true
      };
    }),
    on(CertificateActions.selectCertificate, (state, action) => {
      return {
        ...state,
        currentCertificateNumber: action.uuid
      };
    }),
    on(CertificateApiActions.certificateSuccess, (state, action) => ({
      ...state,
      collection: action.certificate,
      error: null
    })),
    on(CertificateApiActions.certificateFailure, (state, action) => {
      return {
        ...state,
        user: null,
        gettingStatus: false,
        error: action.error
      };
    })
  )
});

export const CertificateSelect = createSelector(
  createFeatureSelector(certificate),
  (state: CertificateState) => state.collection
);

export const CertificateModalSelect = createSelector(
  createFeatureSelector(certificate),
  (state: CertificateState) => state.closeModal
);

export const CertificateSelectError = createSelector(
  createFeatureSelector(certificate),
  (state: CertificateState) => state.error
);
