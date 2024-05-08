import { NgForOf, TitleCasePipe } from '@angular/common';
import {
  Component,
  Injector,
  OnInit,
  WritableSignal,
  effect,
  inject,
  signal
} from '@angular/core';
import { CertificateSelect } from '@shared/store/reducers/certificate.reducer';
import { Certificate } from '@shared/models/interface/certificate.interface';
import { CertificateActions } from '@shared/store/actions/auth-certificate.actions';
import { trigger, transition, style, animate } from '@angular/animations';

import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';

class DataModel {
  title: string;
  infor: string | number;
}

@Component({
  selector: 'app-certificate-voucher',
  standalone: true,
  imports: [NgForOf, TitleCasePipe, ButtonModule],
  template: `
    <div class="w-full" [@slideInLeft]>
      <div class="flex flex-column align-items-center w-full mb-4">
        <img style="width: 18.75rem" src="assets/images/Logo1.png" />

        <small
          >Abaixo informamos os dados relativos à validação do certificado de
          número: <small class="font-bold">{{ certificate().id }}</small></small
        >
      </div>

      <div class="border-solid border-2 border-round-sm	surface-border p-3 m-4">
        <ul *ngFor="let data of dataModel">
          <li class="flex gap-2">
            <span class="font-bold">{{ data.title | titlecase }}:</span>
            <label>{{ data?.infor }}</label>
          </li>
        </ul>
      </div>

      <div class="w-full flex align-items-center justify-content-center mb-4">
        <span
          >Certificado emitido pelo ECOCURSOS EDUCACAO A DISTÂNCIA
          através de seu portal www.ecocursos.com.br
        </span>
      </div>

      <div class="w-full flex justify-content-center">
        <p-button
          (onClick)="closeModal()"
          label="Fechar comprovante"
          size="small"
        />
      </div>
    </div>
  `,
  animations: [
    trigger('slideInLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('500ms ease-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class CertificateVoucherComponent implements OnInit {
  private store = inject(Store);
  private injector = inject(Injector);

  certificate: WritableSignal<Certificate> = signal<Certificate>(
    new Certificate()
  );
  dataModel = [new DataModel()];
  formatter = new Intl.DateTimeFormat('pt-br', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  ngOnInit(): void {
    this.getDataValues();
    this.dataEffect();
  }

  getDataValues(): void {
    this.store.select(CertificateSelect).subscribe({
      next: res => {
        if (res) this.certificate.update(() => res);
      }
    });
  }

  dataEffect(): void {
    const createDate = new Date(this.certificate().dataCadastro);
    const formattedDate = this.formatter.format(createDate);

    effect(
      () => {
        if (this.certificate()) {
          this.dataModel = [
            {
              title: 'aluno',
              infor: this.certificate().matricula.aluno.nome
            },
            {
              title: 'curso',
              infor: this.certificate().matricula.curso.titulo
            },
            {
              title: 'carga horária',
              infor: this.certificate().matricula.curso.cargaHoraria
            },
            {
              title: 'data de certificação',
              infor: String(formattedDate)
            }
          ];
        }
      },
      { injector: this.injector }
    );
  }

  closeModal(): void {
    this.store.dispatch(CertificateActions.closeModal());
  }
}
