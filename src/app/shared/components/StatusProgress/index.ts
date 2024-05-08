import {
  Component,
  Injector,
  OnInit,
  WritableSignal,
  effect,
  inject,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ModalSelector } from '@shared/store/reducers/modal.reducer';
import { ModalAction } from '@shared/store/actions/modal.actions';
import { Constants } from '@shared/utils/constants';

import { Store } from '@ngrx/store';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';

import { Environment as env } from '../../../../environments/environment';

interface ProccessType {
  status: string;
  icon: string;
  iconColor: string;
}

@Component({
  selector: 'app-status-progress',
  standalone: true,
  imports: [
    InputTextModule,
    ProgressBarModule,
    ButtonModule,
    FormsModule,
    NgClass,
    NgIf
  ],
  template: `
    <p-progressBar [value]="ticketResponse()" />
    <div class="w-full flex align-items-center flex-column gap-3 mt-5">
      <i
        class="pi text-6xl {{ processForTicket.icon }} {{
          processForTicket.iconColor
        }}"
      ></i>
      <h3>{{ processForTicket.status }}</h3>
      <p-button
        *ngIf="ticketResponse() === 100 && status() === 'success'"
        [label]="text() === 'credit-card' ? 'Ir para o portal' : 'Abrir Boleto'"
        icon="pi pi-external-link"
        [iconPos]="'right'"
        [link]="true"
        (onClick)="goToPayment()"
      />
    </div>
    <footer
      [ngClass]="
        status() === 'success' ? 'justify-content-start' : 'justify-content-end'
      "
      class="w-full mt-3 flex "
    >
      <p-button
        *ngIf="ticketResponse() === 100"
        [label]="status() === 'success' ? 'Página inicial' : 'Tentar novamente'"
        [icon]="status() === 'success' ? 'pi pi-chevron-left' : 'pi pi-replay'"
        [iconPos]="status() === 'success' ? 'left' : 'right'"
        [size]="'small'"
        (onClick)="status() === 'success' ? goToHome() : onPaymentRetry()"
      />
    </footer>
  `
})
export class StatusProgressComponent implements OnInit {
  ticketResponse = signal(9);

  visible = signal<boolean>(false);
  invoiceId = signal<string>('');
  userReference = signal<string>('');
  discountValue: WritableSignal<number> = signal<number>(0);
  cartSubTotalPrice = signal<number>(0);
  processForTicket: ProccessType;
  isSuccess = signal<boolean>(false);
  pdfLink = signal<string>('');
  portalLink = Constants.portalLink;

  text = signal<'ticket' | 'credit-card' | undefined>(undefined);
  status = signal<string | null>('');

  private store = inject(Store);
  private injector = inject(Injector);
  private router = inject(Router);

  ngOnInit(): void {
    this.getStateValue();
    this.statusValidation();
    this.awaitTicketCreation();
    this.processForTicket = {
      status: `Processando pagamento ...`,
      icon: 'pi-hourglass pi-spin',
      iconColor: 'text-gray-600'
    };
  }

  getStateValue(): void {
    this.store.select(ModalSelector).subscribe({
      next: modal => {
        if (modal.open?.page === 'credit-card') {
          this.text.update(() => modal.open?.page);
          this.status.update(() => {
            if (modal.status === 'success' || modal.status === 'fail')
              this.ticketResponse.update(() => 45);
            return modal.status;
          });
        }
      }
    });
  }

  awaitTicketCreation(): void {
    const interval = setInterval(() => {
      if (this.ticketResponse() > 9) {
        this.ticketResponse.update(
          () => this.ticketResponse() + Math.floor(Math.random() * 10) + 9
        );
        if (this.ticketResponse() >= 100) {
          this.ticketResponse.set(100);
          clearInterval(interval);
        }
      }
    }, 500);
  }

  statusValidation(): void {
    effect(
      () => {
        if (this.ticketResponse() === 100) {
          if (this.status() === 'success')
            this.processForTicket = {
              icon: 'pi-thumbs-up',
              status:
                this.text() === 'credit-card'
                  ? 'Pagamento efetivado com sucesso'
                  : 'Boleto gerado com sucesso',
              iconColor: 'text-green-600'
            };
          else
            this.processForTicket = {
              icon: 'pi-ban',
              status:
                this.text() === 'credit-card'
                  ? 'Falha ao realizar pagamento'
                  : 'Falha na geração do boleto',
              iconColor: 'text-red-600'
            };
        }
      },
      { injector: this.injector }
    );
  }

  onPaymentRetry(): void {
    this.store.dispatch(ModalAction.close());
  }

  goToHome(): void {
    this.router.navigate(['']);
    this.store.dispatch(ModalAction.close());
  }

  goToPayment(): void {
    window.open(
      this.text() === 'credit-card' ? this.portalLink : this.pdfLink()
    );
  }
}
