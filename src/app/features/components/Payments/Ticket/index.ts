import {
  Component,
  Injector,
  OnInit,
  WritableSignal,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  userDetailsDiscountSelect,
  userDetailsSelect
} from '@shared/store/reducers/user-details.reducer';
import { TicketActions } from '@shared/store/actions/ticket.actions';
import { cartTotalPriceSelector } from '@shared/store/reducers/cart.reducer';
import {
  ticketSelect,
  ticketSelectError
} from '@shared/store/reducers/ticket.reducer';
import { NgClass, NgIf } from '@angular/common';

import { combineLatest } from 'rxjs';

import { ProgressBarModule } from 'primeng/progressbar';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [ButtonModule, DialogModule, ProgressBarModule, NgIf, NgClass],
  template: `
    <div class="flex flex-column">
      <p class="text-base mb-3">
        Clique no botão abaixo e aguarde o seu boleto ser gerado.
      </p>

      <p-button
        label="Gerar boleto"
        [loading]="loading"
        (onClick)="onTicketPayment()"
      />

      <p-dialog
        header="Header"
        [visible]="visible()"
        styleClass="w-10 sm:w-9 mg:w-7 lg:w-5"
        [closable]="false"
        [modal]="true"
      >
        <ng-template pTemplate="header"> </ng-template>
        <p-progressBar [value]="ticketResponse()" />
        <div class="w-full flex align-items-center flex-column gap-3 mt-5">
          <i
            class="pi text-6xl {{ processForTicket.icon }} {{
              processForTicket.iconColor
            }}"
          ></i>
          <h3>{{ processForTicket.status }}</h3>
          <p-button
            *ngIf="ticketResponse() === 100"
            label="Abrir Boleto"
            icon="pi pi-external-link"
            [iconPos]="'right'"
            [link]="true"
            (onClick)="goToPdf()"
          />
        </div>
        <ng-template pTemplate="footer">
          <p-button
            label="Sair"
            (onClick)="closeModal()"
            [size]="'small'"
            [disabled]="ticketResponse() < 100"
          />
        </ng-template>
      </p-dialog>
    </div>
  `
})
export class TicketComponent implements OnInit {
  loading: boolean;

  ticketResponse = signal<number>(0);
  visible = signal<boolean>(false);
  invoiceId = signal<string>('');
  userReference = signal<string>('');
  discountValue: WritableSignal<number> = signal<number>(0);
  cartSubTotalPrice = signal<number>(0);
  discountTotal = computed(
    () => this.cartSubTotalPrice() * this.discountValue()
  );
  mountTicketPayment = computed(() => {
    return {
      method: 'bank_slip',
      discount_cents: String(this.discountTotal()),
      invoice_id: this.invoiceId(),
      aluno: this.userReference()
    };
  });
  processForTicket = {
    status: 'Aguarde seu boleto ser gerado',
    icon: 'pi-hourglass pi-spin',
    iconColor: 'text-gray-600'
  };
  isSuccess = signal<boolean>(false);
  pdfLink = signal<string>('');

  private store = inject(Store);
  private activatedRoute = inject(ActivatedRoute);
  private injector = inject(Injector);
  private router = inject(Router);

  ngOnInit(): void {
    this.getInvoiceId();
    this.statusValidation();
    this.getTicketResponse();
    this.getDataStoreValues();
    this.awaitTicketCreation();
  }

  statusValidation(): void {
    effect(
      () => {
        if (this.ticketResponse() === 100) {
          if (this.isSuccess())
            this.processForTicket = {
              icon: 'pi-ticket',
              status: 'Boleto gerado com sucesso',
              iconColor: 'text-green-600'
            };
          else
            this.processForTicket = {
              icon: 'pi-ban',
              status: 'Falha na geração do boleto',
              iconColor: 'text-red-600'
            };
        }
      },
      { injector: this.injector }
    );
  }

  getDataStoreValues(): void {
    combineLatest([
      this.store.select(userDetailsSelect),
      this.store.select(userDetailsDiscountSelect),
      this.store.select(cartTotalPriceSelector)
    ]).subscribe(([userDetails, userDetailsDiscount, cartSubTotalPrice]) => {
      if (userDetails)
        userDetails.map(res =>
          this.userReference.update(() => String(res.referencia))
        );

      this.cartSubTotalPrice.update(() => cartSubTotalPrice);
      this.discountValue.update(() => Number(userDetailsDiscount) / 100);
    });
  }

  getTicketResponse(): void {
    combineLatest([
      this.store.select(ticketSelect),
      this.store.select(ticketSelectError)
    ]).subscribe(([ticket, ticketError]) => {
      if (ticket) {
        this.ticketResponse.update(() => 24);
        this.isSuccess.update(() => true);
        this.pdfLink.set(ticket.pdf);
      } else if (ticketError) {
        this.ticketResponse.update(() => 24);
        this.isSuccess.update(() => false);
      }
    });
  }

  awaitTicketCreation(): void {
    const interval = setInterval(() => {
      if (this.ticketResponse() > 0) {
        this.ticketResponse.update(
          () => this.ticketResponse() + Math.floor(Math.random() * 10) + 9
        );
        if (this.ticketResponse() >= 100) {
          this.ticketResponse.set(100);
          clearInterval(interval);
        }
      }
    }, 700);
  }

  getInvoiceId(): void {
    this.activatedRoute.params.subscribe({
      next: param => {
        this.invoiceId.update(() => param['invoice_id']);
      }
    });
  }

  goToPdf(): void {
    window.open(this.pdfLink());
  }

  closeModal(): void {
    this.router.navigate(['/categorias']);
    this.visible.update(() => false);
  }

  onTicketPayment(): void {
    this.visible.set(true);
    this.store.dispatch(
      TicketActions.selectTicket({ ticket: this.mountTicketPayment() })
    );
  }
}
