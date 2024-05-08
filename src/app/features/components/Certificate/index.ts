import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CertificateActions } from '@shared/store/actions/auth-certificate.actions';
import { NgIf } from '@angular/common';
import {
  CertificateSelect,
  CertificateSelectError
} from '@shared/store/reducers/certificate.reducer';
import { CertificateVoucherComponent } from '@shared/components/CertificateVoucher';
import { Certificate } from '@shared/models/interface/certificate.interface';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-authenticate-certificate',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    FormsModule,
    NgIf,
    CertificateVoucherComponent
  ],
  template: `
    <ng-container
      *ngIf="
        !certificateResponse();
        then insertCertificate;
        else voucherCertificate
      "
    >
    </ng-container>

    <ng-template #insertCertificate>
      <div class="flex flex-column">
        <span class="text-lg mb-4">
          O número do certificado está no verso do mesmo emitido pelo aluno.
        </span>

        <div class="flex text-900 flex-column gap-2">
          <label htmlFor="username">Número do Certificado</label>
          <input
            pInputText
            aria-describedby="certificateNumber-help"
            type="text"
            [(ngModel)]="certificateValue"
          />
          <small *ngIf="hasError && certificateValue" class="text-red-600"
            >Insira um número válido</small
          >

          <div class="flex justify-content-end mt-4">
            <p-button
              label="Autenticar"
              [disabled]="certificateValue === ''"
              [loading]="isLoading"
              (onClick)="sendCertificateNumber()"
            />
          </div>
        </div>
      </div>
    </ng-template>
    <ng-template #voucherCertificate>
      <app-certificate-voucher />
    </ng-template>
  `
})
export class CertificateComponent implements OnInit {
  certificateValue = '';
  isLoading = false;
  hasError = false;
  certificateResponse = signal<Certificate | null>(null);

  private store = inject(Store);

  ngOnInit(): void {
    this.closeLoading();
    this.getDataValues();
  }

  getDataValues(): void {
    this.store.select(CertificateSelect).subscribe({
      next: res => {
        if (res) {
          this.certificateResponse.update(() => res);
        }
      }
    });
  }

  closeLoading(): void {
    this.store.select(CertificateSelectError).subscribe({
      next: err => {
        if (err) {
          this.hasError = !this.hasError;
          this.isLoading = false;
        }
      }
    });
  }

  sendCertificateNumber(): void {
    this.isLoading = true;

    this.store.dispatch(
      CertificateActions.selectCertificate({ uuid: this.certificateValue })
    );
  }
}
