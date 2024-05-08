import {
  AfterContentInit,
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { CardNavigationActions } from '@shared/store/actions/card-navigation.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { orderSelect } from '@shared/store/reducers/order.reducer';

import { AccordionModule } from 'primeng/accordion';
import { DividerModule } from 'primeng/divider';
import { Store } from '@ngrx/store';

import { CreditCardComponent } from '../../components/Payments/CreditCard';
import { TicketComponent } from '../../components/Payments/Ticket';
import { QuoteSummaryComponent } from '../../components/QuoteSummary';

@Component({
  selector: 'page-payment',
  standalone: true,
  imports: [
    TitleCasePipe,
    AccordionModule,
    NgTemplateOutlet,
    CreditCardComponent,
    TicketComponent,
    DividerModule,
    QuoteSummaryComponent
  ],
  template: `
    <p-accordion class="shadow-1" [activeIndex]="0">
      <p-accordionTab header="Pague com cartão de crédito">
        <app-credit-card />
      </p-accordionTab>
      <p-accordionTab header="Pague com boleto">
        <app-ticket />
      </p-accordionTab>
    </p-accordion>
  `
})
export class PaymentPageComponent implements AfterContentInit, OnInit {
  pageName = 'Métodos de pagamento';

  private store = inject(Store);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  invoiceRefer = signal('');

  ngOnInit(): void {
    this.store.select(orderSelect).subscribe({
      next: order => {
        if (order) this.invoiceRefer.set(order.referencia);
      }
    });

    this.invoice_IdIsValid();
  }

  ngAfterContentInit(): void {
    this.store.dispatch(CardNavigationActions.enter());
    this.store.dispatch(
      CardNavigationActions.selectPage({
        page: `${this.pageName}`
      })
    );
  }

  invoice_IdIsValid(): void {
    this.activatedRoute.params.subscribe(prs => {
      const invoice = prs['invoice_id'];

      if (invoice !== this.invoiceRefer())
        this.router.navigate(['carrinho-de-compras']);
    });
  }
}
