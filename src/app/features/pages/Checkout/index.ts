import {
  Component,
  Injector,
  OnInit,
  WritableSignal,
  effect,
  inject,
  signal
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { cartTotalHoursSelector } from '@shared/store/reducers/cart.reducer';
import {
  userDetailsAvailableHoursSelect,
  userDetailsPartner
} from '@shared/store/reducers/user-details.reducer';

import { combineLatest } from 'rxjs';

import { AccordionModule } from 'primeng/accordion';
import { Store } from '@ngrx/store';
import { Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';

import { QuoteSummaryComponent } from '../../components/QuoteSummary';
import { CreditCardComponent } from '../../components/Payments/CreditCard';
import { TicketComponent } from '../../components/Payments/Ticket';
import { CardNavigationComponent } from '../../../core/components/CardNavigation';

@Component({
  selector: 'page-checkout',
  standalone: true,
  template: `
    <app-card-navigation />
    <div style="min-height: 80vh" class="w-90rem m-auto px-0 mt-4 md:px-4">
      <p-messages
        [(value)]="messages"
        [closable]="true"
        styleClass="flex w-full justify-content-between"
      />
      <div
        class="md:flex-row flex-column-reverse grid m-0 flex
        flex-column flex-column-reverse justify-content-between"
      >
        <div class="md:col-8 col-12">
          <router-outlet></router-outlet>
        </div>
        <div class="md:col-4 col-12 flex flex-1 justify-content-end h-full">
          <app-quote-summary class="w-full" />
        </div>
      </div>
    </div>
  `,
  imports: [
    RouterOutlet,
    QuoteSummaryComponent,
    AccordionModule,
    CreditCardComponent,
    TicketComponent,
    CardNavigationComponent,
    MessagesModule
  ]
})
export class CheckoutPageComponent implements OnInit {
  private store = inject(Store);
  private injector = inject(Injector);
  messages: Message[] = [];

  availableHours = signal<number>(0);
  totalHours: WritableSignal<number> = signal<number>(0);
  isUserPartner: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    this.getStateDataValues();
    this.messageValidation();
  }

  getStateDataValues(): void {
    combineLatest([
      this.store.select(cartTotalHoursSelector),
      this.store.select(userDetailsAvailableHoursSelect),
      this.store.select(userDetailsPartner)
    ]).subscribe(([cartTotalHours, userAvailableHours, userDetailsPartner]) => {
      this.totalHours.update(() => cartTotalHours);
      this.availableHours.update(() => userAvailableHours ?? 0);
      if (userDetailsPartner)
        this.isUserPartner.update(() => userDetailsPartner);
    });
  }

  messageValidation(): void {
    effect(
      () => {
        if (this.isUserPartner() && this.totalHours() > this.availableHours())
          this.messages = [
            {
              severity: 'warn',
              summary: 'Atenção',
              detail: `Esse curso será cobrado! Pois você ultrapassou ${
                this.totalHours() - this.availableHours()
              } horas, do total de 360h permitido gratuitamente por semestre.`
            }
          ];
        else this.messages = [];
      },
      { injector: this.injector }
    );
  }
}
