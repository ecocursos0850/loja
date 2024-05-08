import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { CertificateModalSelect } from '@shared/store/reducers/certificate.reducer';
import { InforCardType } from '@shared/models/interface/infor-card.interface';
import { CertificateActions } from '@shared/store/actions/auth-certificate.actions';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Store } from '@ngrx/store';

import { CertificateComponent } from '../Certificate';
import { Constants } from '../../../shared/utils/constants/index';

@Component({
  selector: 'app-infor-card',
  standalone: true,
  imports: [ButtonModule, CommonModule, DialogModule, UpperCasePipe],
  template: `
    <div class="p-3 bg-red-600 w-full">
      <div
        class="grid p-fluid align-items-center justify-content-between w-90rem m-auto"
      >
        <div
          *ngFor="let infor of informations"
          class="flex col-12 align-items-center sm:flex-column lg:col-3 lg:flex-row md:col-4 lg:justify-content-center
            md:gap-2 lg:text-left md:text-center md:flex-column sm:col-4 sm:text-center gap-3"
        >
          <img
            class="custom__w-image"
            src="{{ infor.image }}"
            alt="{{ infor.label }}"
          />
          <div class="flex flex-column">
            <span
              class="lg:text-lg md:text-base sm:text-sm text-sm text-white font-bold"
              >{{ infor.label }}</span
            >
            <label class="text-xs md:text-sm line-height-2 text-gray-100">{{
              infor.description
            }}</label>
          </div>
        </div>

        <div
          class="flex justify-content-center
          align-items-center col-12 sm:mt-4 md:mt-1
          lg:mt-0 lg:col-3 md:col-12 sm:col-12 gap-3"
        >
          <p-button
            [label]="'Autenticar seu certificado' | uppercase"
            class="custom__w-full"
            styleClass="text-sm max-w-30rem md:max-w-20rem border-round-2xl bg-indigo-900 border-transparent"
            (onClick)="openCertificateModal()"
          />
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @media screen and (max-width: 500px) {
        .custom__w-full {
          width: 100%;
        }
        .custom__w-image {
          width: 2.5rem !important;
        }
      }
    `
  ],
  providers: [DialogService, DynamicDialogRef]
})
export class InforCardComponent implements OnInit, OnDestroy {
  private dialogService = inject(DialogService);
  private ref = inject(DynamicDialogRef);
  private store = inject(Store);

  informations: InforCardType[] = Constants.InforCardConstants;
  modalIsVisible = false;

  ngOnInit(): void {
    this.store.select(CertificateModalSelect).subscribe({
      next: res => {
        if (res) this.ref.close();
      }
    });
  }

  openCertificateModal(): void {
    this.store.dispatch(CertificateActions.enter());

    this.ref = this.dialogService.open(CertificateComponent, {
      header: 'Autenticar Certificado',
      contentStyle: { overflow: 'auto' },
      styleClass: 'w-10 sm:w-9 mg:w-7 lg:w-5',
      baseZIndex: 1,
      maximizable: false
    });
  }

  closeCertificateModal(): void {
    this.ref.close();
  }

  ngOnDestroy(): void {
    if (this.ref) this.ref.close();
  }
}
