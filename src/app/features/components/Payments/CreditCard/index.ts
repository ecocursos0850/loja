import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CheckoutActions } from '@shared/store/actions/checkout.actions';
import { CreditCardService } from '@shared/services/credit-card-icons.service';
import { checkoutTotalPaymentSelect } from '@shared/store/reducers/checkout.reducer';

import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { Store } from '@ngrx/store';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CalendarModule } from 'primeng/calendar';

import { DirectBillingModel } from './../../../../shared/models/classes/direct-billing.model';
import { Constants } from '../../../../shared/utils/constants/index';

export interface CreditCardType {
  name: string;
  code: string;
  icon?: string;
}

@Component({
  selector: 'app-credit-card',
  standalone: true,
  imports: [
    TitleCasePipe,
    AccordionModule,
    NgTemplateOutlet,
    ButtonModule,
    CheckboxModule,
    DividerModule,
    DropdownModule,
    InputMaskModule,
    CommonModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    CalendarModule
  ],
  template: `
    <div class="gap-4 flex flex-column">
      <div class="flex flex-column w-full">
        <small class="mb-3"> Aceitamos os cartões de crédito:</small>
        <img src="../../../../../assets/images/cards.png" alt="payment cards" />
      </div>

      <form
        autocomplete="true"
        [formGroup]="form"
        class="mt-3 w-full"
        (ngSubmit)="onSubmit(form)"
      >
        <section class="grid formgrid p-fluid m-0">
          <div
            class="field col-12 sm:col-6 md:col-6  mb-4 flex flex-column flex-wrap"
          >
            <label
              for="creditCard"
              htmlFor="creditCard"
              class="font-medium text-900"
              >Bandeira do cartão
              <small
                id="creditCard-help"
                [ngClass]="
                  form.get('creditCard')?.invalid
                    ? 'text-red-500'
                    : 'text-green-500'
                "
              >
                *
              </small>
            </label>
            <p-dropdown
              [options]="creditCard"
              formControlName="creditCard"
              [filter]="true"
              filterBy="name"
              [showClear]="true"
              optionLabel="name"
              placeholder="Escolha a bandeira"
            >
              <ng-template pTemplate="selectedItem" let-selectedCard>
                <div class="flex align-items-center gap-2" *ngIf="creditCard">
                  <img
                    [src]="selectedCard?.icon"
                    style="width: 18px"
                    [alt]=""
                  />
                  <div>{{ selectedCard?.name }}</div>
                </div>
              </ng-template>
              <ng-template let-card pTemplate="item">
                <div class="flex align-items-center gap-2">
                  <img [src]="card?.icon" style="width: 18px" />
                  <div>{{ card?.name }}</div>
                </div>
              </ng-template>
            </p-dropdown>
          </div>

          <div class="field col-12 sm:col-12 md:col-6 mb-4">
            <label
              for="creditCardNumber"
              htmlFor="creditCardNumber"
              class="font-medium text-900"
              >Número do Cartão
              <small
                id="creditCardNumber-help"
                [ngClass]="
                  form.get('creditCardNumber')?.invalid
                    ? 'text-red-500'
                    : 'text-green-500'
                "
              >
                *
              </small>
            </label>
            <div>
              <p-inputMask
                mask="9999 9999 9999 9999"
                formControlName="creditCardNumber"
                id="creditCardNumber_input"
              />
            </div>
          </div>

          <div class="field col-12 md:col-6 mb-4">
            <label
              for="firstName"
              htmlFor="firstName"
              class="font-medium text-900"
              >Nome
              <small
                id="firstName-help"
                [ngClass]="
                  form.get('firstName')?.invalid
                    ? 'text-red-500'
                    : 'text-green-500'
                "
              >
                *
              </small>
            </label>
            <div>
              <input
                pInputText
                id="firstName"
                class="p-component p-element"
                formControlName="firstName"
              />
            </div>
          </div>

          <div class="field col-12 md:col-6 mb-4">
            <label
              for="lastName"
              htmlFor="lastName"
              class="font-medium text-900"
              >Sobrenome
              <small
                id="lastName-help"
                [ngClass]="
                  form.get('lastName')?.invalid
                    ? 'text-red-500'
                    : 'text-green-500'
                "
              >
                *
              </small>
            </label>
            <div>
              <input
                pInputText
                id="lastName"
                class="p-inputtext p-component p-element"
                formControlName="lastName"
              />
            </div>
          </div>

          <div class="field col-8  md:col-4 mb-4">
            <label
              for="cardExpiration"
              htmlFor="cardExpiration"
              class="font-medium text-900"
              >Validade
              <small
                id="cardExpiration-help"
                [ngClass]="
                  form.get('cardExpiration')?.invalid
                    ? 'text-red-500'
                    : 'text-green-500'
                "
              >
                *
              </small>
            </label>
            <div>
              <p-calendar
                formControlName="cardExpiration"
                [showIcon]="true"
                view="month"
                dateFormat="mm/yy"
                [readonlyInput]="true"
              />
            </div>
          </div>

          <div class="field col-4 sm:col-12 md:col-3 mb-4">
            <label
              for="securityCode"
              htmlFor="securityCode"
              class="font-medium text-900"
              >CVV
              <small
                id="securityCode-help"
                [ngClass]="
                  form.get('securityCode')?.invalid
                    ? 'text-red-500'
                    : 'text-green-500'
                "
              >
                *
              </small>
            </label>
            <div>
              <p-inputMask
                mask="999"
                formControlName="securityCode"
                id="securityCode_input"
              />
            </div>
          </div>

          <div class="field col-12 sm:col-4 md:col-5 mb-4">
            <label
              for="numberPlots"
              htmlFor="numberPlots"
              class="font-medium text-900"
              >Parcelas
              <small
                id="numberPlots-help"
                [ngClass]="
                  form.get('numberPlots')?.invalid
                    ? 'text-red-500'
                    : 'text-green-500'
                "
              >
                *
              </small>
            </label>
            <p-dropdown
              [options]="numberPlots"
              formControlName="numberPlots"
              [showClear]="true"
              optionLabel="name"
              placeholder="Número de Parcelas"
            />
          </div>
        </section>

        <p-divider class="col-12" />

        <footer class="w-full mt-4">
          <div class="flex justify-content-center">
            <p-button
              [disabled]="!form.valid"
              type="submit"
              label="Pagar com cartão"
              styleClass="font-bold"
            />
          </div>
        </footer>
      </form>
    </div>
  `
})
export class CreditCardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private activatedRoute = inject(ActivatedRoute);
  private creditCardService = inject(CreditCardService);

  form: FormGroup;
  creditCard: CreditCardType[];
  numberPlots: CreditCardType[] = [];
  plots: CreditCardType[] = [];
  invoiceId: string;

  ngOnInit(): void {
    this.getCreditCardItems();
    this.calculateNumberPlots();
    this.getInvoiceId();
    this.configFormValues();
  }

  configFormValues(): void {
    this.form = this.fb.group({
      creditCard: [this.creditCard, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      creditCardNumber: [
        '',
        [(Validators.required, this.creditCardNumberValidator)]
      ],
      cardExpiration: ['', Validators.required],
      securityCode: ['', Validators.required],
      numberPlots: [null, [Validators.required]]
    });
  }

  getCreditCardItems(): void {
    this.creditCardService.getIcons().then(card => (this.creditCard = card));
  }

  creditCardNumberValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const creditCardNumber = control.value;
    const creditCardNumberWithoutMask = creditCardNumber.replace(/\s/g, '');
    const creditCardRegex = Constants.masks.creditCard;

    if (!creditCardRegex.test(creditCardNumberWithoutMask)) {
      return { invalidCreditCardNumber: true };
    }

    return null;
  }

  calculateNumberPlots = (): void => {
    this.store.select(checkoutTotalPaymentSelect).subscribe({
      next: calculateTotalPayment => {
        this.plots = Array.from({ length: 12 }, (_, index) => {
          const installment = index + 1;
          const endValue =
            installment !== 0
              ? (calculateTotalPayment / installment).toFixed(2)
              : '0.00';
          return {
            name: `${installment}x R$ ${endValue}`,
            code: installment.toString()
          };
        });

        this.numberPlots = this.plots;
      }
    });
  };

  getInvoiceId(): void {
    this.activatedRoute.params.subscribe({
      next: param => {
        this.invoiceId = param['invoice_id'];
      }
    });
  }

  onSubmit(createMemberProps: FormGroup): void {
    const registerValue = createMemberProps.value;
    const date = new Date(registerValue.cardExpiration);
    const creditCardNumber = registerValue.creditCardNumber.replace(/\s/g, '');
    const billing: DirectBillingModel = {
      discount_cents: '0',
      months: registerValue.numberPlots.code,
      invoice_id: this.invoiceId,
      infoCard: {
        number: creditCardNumber,
        verification_value: registerValue.securityCode,
        first_name: registerValue.firstName,
        last_name: registerValue.lastName,
        month: String(date.getMonth() + 1),
        year: String(date.getFullYear())
      }
    };

    this.store.dispatch(CheckoutActions.selectCheckout({ checkout: billing }));
  }
}
