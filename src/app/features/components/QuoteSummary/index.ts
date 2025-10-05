import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  cartItemsSelector,
  cartTotalHoursSelector,
  cartTotalPriceSelector
} from '@shared/store/reducers/cart.reducer';
import { CurrencyPipe, NgClass, NgIf, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { discountCouponSelect } from '@shared/store/reducers/discount-coupon.reducer';
import { LoadingAction } from '@shared/store/actions/loading.actions';
import { DiscountCouponType } from '@shared/models/classes/ticket.interface.model';
import {
  userDetailsAvailableHoursSelect,
  userDetailsDiscountSelect,
  userDetailsSelect
} from '@shared/store/reducers/user-details.reducer';
import { CheckoutActions } from '@shared/store/actions/checkout.actions';
import { CartType } from '@shared/models/classes/cart-market.model';

import { combineLatest } from 'rxjs';

import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { AnimateModule } from 'primeng/animate';
import { Store } from '@ngrx/store';
import { InplaceModule } from 'primeng/inplace';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CouponComponent } from '../Coupon';

@Component({
  selector: 'app-quote-summary',
  standalone: true,
  imports: [
    DividerModule,
    PercentPipe,
    ButtonModule,
    RouterLink,
    AnimateModule,
    CurrencyPipe,
    NgIf,
    NgClass,
    InplaceModule,
    InputTextModule,
    RippleModule,
    DialogModule,
    FormsModule
  ],
  template: `
    <div class="card shadow-1 text-900 w-full">
      <div [ngClass]="hasFreeCourses() ? 'text-gray-400' : ''">
        <small>Você irá pagar</small>
        <p class="text-5xl font-bold pt-2 pb-4 pl-4">
          {{ total() | currency }}
        </p>
      </div>
      <div
        [ngClass]="hasFreeCourses() ? 'text-gray-400' : ''"
        class="line-height-4"
      >
        <div class="flex justify-content-between">
          <strong
            >Subtotal ({{ totalItems() }}
            {{ totalItems() > 1 ? 'cursos' : 'curso' }})</strong
          >
          <span>{{ totalPrice() | currency }}</span>
        </div>
        
        <!-- Desconto 100% para parceiros NÃO conveniados -->
        <div *ngIf="hasFreeCourses()" class="line-height-4 flex justify-content-between text-green-600">
          <strong>Desconto Parceiro (Horas Gratuitas)</strong>
          <span>- {{ freeCoursesDiscountValue() | currency }}</span>
        </div>
        
        <!-- Desconto de 10% para parceiros conveniados -->
        <div *ngIf="hasAffiliatedDiscount() && !hasFreeCourses()" class="line-height-4 flex justify-content-between text-blue-600">
          <strong>Desconto Parceiro (10%)</strong>
          <span>- {{ affiliatedDiscountValue() | currency }}</span>
        </div>

        <!-- Desconto Pós -->
        <div *ngIf="hasPosGraduacaoDiscount()" class="line-height-4 flex justify-content-between text-purple-600">
          <strong>Desconto Pós-Graduação/MBA ({{ getPosGraduacaoDiscountPercent() }}%)</strong>
          <span>- {{ posGraduacaoDiscountValue() | currency }}</span>
        </div>

        <!-- Cupom -->
        <div *ngIf="couponDiscount()?.valor" class="flex justify-content-between text-orange-600">
          <strong>Cupom de desconto</strong>
          <span>- {{ couponDiscount()?.valor }}%</span>
        </div>
      </div>
      <p-divider />
      <div
        [ngClass]="hasFreeCourses() ? 'text-gray-400' : ''"
        class="line-height-4 flex justify-content-between"
      >
        <strong>Total</strong>
        <span>{{ total() | currency }}</span>
      </div>

      <div
        class="w-full mt-2 flex justify-content-center"
      >
        <p-button
          (click)="handleCouponModal()"
          size="small"
          [text]="true"
          class="w-full"
          styleClass="pl-0"
          icon="pi pi-ticket"
          pRipple
          label="Inserir cupom de desconto"
        >
        </p-button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService]
})
export class QuoteSummaryComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private dialogService = inject(DialogService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private router = inject(Router);

  ref: DynamicDialogRef | undefined;

  totalPrice = signal<number>(0);
  totalItems = signal<number>(0);
  total = signal<number>(0);
  couponDiscount = signal(new DiscountCouponType());
  hasFreeCourses = signal<boolean>(false);
  hasAffiliatedDiscount = signal<boolean>(false);
  isRegularUser = signal<boolean>(true);
  isNonAffiliatedPartner = signal<boolean>(false);
  isAffiliatedPartner = signal<boolean>(false);
  availableHours = signal<number>(0);
  cartTotalHours = signal<number>(0);
  partnerName = signal<string>('');
  cartItems = signal<CartType[]>([]);
  direitoOnlineTotalHours = signal<number>(0);

  direitoOnlineSubtotal = signal<number>(0);
  posGraduacaoSubtotal = signal<number>(0);
  otherCategoriesTotal = signal<number>(0);
  freeCoursesDiscountValue = signal<number>(0);
  affiliatedDiscountValue = signal<number>(0);
  posGraduacaoDiscountValue = signal<number>(0);

  ngOnInit(): void {
    this.getCartData();
  }

  getCartData(): void {
    combineLatest([
      this.store.select(cartTotalPriceSelector),
      this.store.select(cartItemsSelector),
      this.store.select(discountCouponSelect),
      this.store.select(userDetailsDiscountSelect),
      this.store.select(userDetailsAvailableHoursSelect),
      this.store.select(cartTotalHoursSelector),
      this.store.select(userDetailsSelect)
    ]).subscribe(
      ([
        totalPrice,
        items,
        coupon,
        ,
        availableHours,
        cartTotalHours,
        userDetails
      ]) => {
        this.totalPrice.set(totalPrice);
        this.totalItems.set(items.length);
        this.cartItems.set(items);
        this.availableHours.set(availableHours || 0);
        this.cartTotalHours.set(cartTotalHours);

        // Calcular subtotais
        this.calculateSubtotals();

        // aplicar cupom
        if (coupon) {
          this.couponDiscount.set(coupon);
          this.store.dispatch(LoadingAction.loading({ message: false }));
          this.ref?.close();
        }

        this.calculateTotalPayment();

        this.store.dispatch(
          CheckoutActions.selectTotalPayment({ total: this.total() })
        );

        this.changeDetectorRef.markForCheck();
      }
    );
  }

  handleCouponModal(): void {
    this.ref = this.dialogService.open(CouponComponent, {
      header: 'Cupom',
      contentStyle: { overflow: 'auto' },
      styleClass: 'w-10 sm:w-9 mg:w-7 lg:w-5',
      baseZIndex: 10000
    });
  }

  private calculateSubtotals(): void {
    const items = this.cartItems();

    this.direitoOnlineSubtotal.set(
      items
        .filter(item => item.categoria?.titulo?.toLowerCase().includes('direito online'))
        .reduce((acc, item) => acc + (item.preco || 0), 0)
    );

    this.posGraduacaoSubtotal.set(
      items
        .filter(item => {
          const titulo = item.categoria?.titulo?.toLowerCase() || '';
          return titulo.includes('pós') || titulo.includes('mba');
        })
        .reduce((acc, item) => acc + (item.preco || 0), 0)
    );

    this.otherCategoriesTotal.set(
      items
        .filter(item => {
          const titulo = item.categoria?.titulo?.toLowerCase() || '';
          return !titulo.includes('direito online') && !titulo.includes('pós') && !titulo.includes('mba');
        })
        .reduce((acc, item) => acc + (item.preco || 0), 0)
    );

    // Aplicar descontos fixos de parceiro (se houver)
    this.freeCoursesDiscountValue.set(this.direitoOnlineSubtotal());
    this.affiliatedDiscountValue.set(this.direitoOnlineSubtotal() * 0.1);
    this.posGraduacaoDiscountValue.set(this.posGraduacaoSubtotal() * this.getPosGraduacaoDiscountPercent() / 100);
  }

  private calculateTotalPayment(): void {
    let totalCalculado = 0;

    if (this.hasFreeCourses()) {
      totalCalculado = this.otherCategoriesTotal() + (this.posGraduacaoSubtotal() - this.posGraduacaoDiscountValue());
    } else if (this.hasAffiliatedDiscount() || this.hasPosGraduacaoDiscount()) {
      totalCalculado = this.otherCategoriesTotal() +
        (this.direitoOnlineSubtotal() - this.affiliatedDiscountValue()) +
        (this.posGraduacaoSubtotal() - this.posGraduacaoDiscountValue());
    } else {
      totalCalculado = this.totalPrice();
    }

    // aplica desconto do cupom sobre o total final
    if (this.couponDiscount()?.valor) {
      const desconto = (this.couponDiscount().valor / 100) * totalCalculado;
      totalCalculado -= desconto;
    }

    this.total.set(totalCalculado);
  }

  // 🔹 NOVOS MÉTODOS PARA O DESCONTO DE PÓS-GRADUAÇÃO
  hasPosGraduacaoDiscount(): boolean {
    return this.hasAnyPosGraduacaoCourse() && (this.isNonAffiliatedPartner() || this.isAffiliatedPartner());
  }

  getPosGraduacaoDiscountPercent(): number {
    if (this.isNonAffiliatedPartner()) {
      return 20; // 20% para parceiros NÃO conveniados
    } else if (this.isAffiliatedPartner()) {
      return 10; // 10% para parceiros conveniados
    }
    return 0;
  }

  // 🔹 MÉTODO DE APOIO
  private hasAnyPosGraduacaoCourse(): boolean {
    return this.cartItems().some(item => {
      const titulo = item.categoria?.titulo?.toLowerCase() || '';
      return titulo.includes('pós') || titulo.includes('mba');
    });
  }

  ngOnDestroy(): void {
    if (this.ref) this.ref.close();
  }
}
