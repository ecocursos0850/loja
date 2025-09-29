import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
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
  userDetailsPartner,
  userDetailsSelect
} from '@shared/store/reducers/user-details.reducer';
import { CheckoutActions } from '@shared/store/actions/checkout.actions';
import { CartType } from '@shared/models/classes/cart-market.model';

import { combineLatest, filter } from 'rxjs';

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
        
        <!-- Desconto 100% para parceiros NÃO conveniados com horas suficientes -->
        <div *ngIf="hasFreeCourses()" class="line-height-4 flex justify-content-between text-green-600">
          <strong>Desconto Parceiro (Horas Gratuitas)</strong>
          <span>-100%</span>
        </div>
        
        <!-- Desconto de 10% para parceiros conveniados -->
        <div *ngIf="hasAffiliatedDiscount() && !hasFreeCourses()" class="line-height-4 flex justify-content-between text-blue-600">
          <strong>Desconto Parceiro</strong>
          <span>-10%</span>
        </div>

        <!-- Outros descontos -->
        <div
          *ngIf="!hasFreeCourses() && !hasAffiliatedDiscount() && discountPercent() > 0"
          class="line-height-4 flex justify-content-between"
        >
          <strong>Descontos</strong>
          <span>
            {{ discountPercent() > 0 ? '-' : '' }}
            {{ discountPercent() | percent }}</span
          >
        </div>

        <ng-container
          *ngIf="
            !couponDiscount()?.valor;
            then insertCouponValue;
            else hasCouponValue
          "
        >
        </ng-container>
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
        *ngIf="!showButtonBack()"
        class="w-full mt-2 flex justify-content-center"
      >
        <p-button
          [routerLink]="'/carrinho-de-compras'"
          styleClass="p-button-link text-sm"
          label="Vizualizar carrinho"
        />
      </div>
    </div>

    <ng-template #hasCouponValue>
      <div
        [ngClass]="hasFreeCourses() ? 'text-gray-400' : ''"
        class="flex justify-content-between"
      >
        <strong> Cupom de desconto </strong>
        <span>- {{ couponDiscount()?.valor }} %</span>
      </div>
    </ng-template>

    <ng-template #insertCouponValue>
      <p-button
        (click)="handleCouponModal()"
        [disabled]="hasFreeCourses() || disabledCouponButton()"
        size="small"
        [text]="true"
        class="w-full"
        styleClass="pl-0"
        icon="pi pi-ticket"
        pRipple
        label="Inserir cupom de desconto"
      >
      </p-button>
    </ng-template>
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
  showButtonBack = signal<boolean>(true);
  disabledCouponButton = signal<boolean>(false);
  discountPercent = signal<number>(0);
  hasFreeCourses = signal<boolean>(false);
  hasAffiliatedDiscount = signal<boolean>(false);
  isRegularUser = signal<boolean>(true);
  availableHours = signal<number>(0);
  cartTotalHours = signal<number>(0);
  partnerName = signal<string>('');

  ngOnInit(): void {
    this.getCartData();
    this.checkCurrentRoute();
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
        discountPercent,
        availableHours,
        cartTotalHours,
        userDetails
      ]) => {
        this.totalPrice.update(() => totalPrice);
        this.totalItems.set(items.length);
        this.availableHours.set(availableHours || 0);
        this.cartTotalHours.set(cartTotalHours);

        // RESETAR ESTADOS
        this.isRegularUser.set(true);
        this.hasFreeCourses.set(false);
        this.hasAffiliatedDiscount.set(false);
        this.partnerName.set('');

        // VERIFICAÇÃO DO TIPO DE USUÁRIO (igual ao CartPageComponent)
        if (userDetails && userDetails.length > 0) {
          const user = userDetails[0];
          
          // REGRA 1: Usuário regular (sem parceiro) - SEM DESCONTO
          if (!user.parceiro) {
            this.isRegularUser.set(true);
            this.hasFreeCourses.set(false);
            this.hasAffiliatedDiscount.set(false);
            this.partnerName.set('');
          }
          // REGRA 2: Usuário com parceiro
          else if (user.parceiro) {
            this.isRegularUser.set(false);
            this.partnerName.set(user.parceiro.nome || '');
            
            if (user.parceiro.isParceiro === true) {
              // REGRA 2A: Parceiro NÃO conveniado (isParceiro = true) - HORAS GRATUITAS
              this.hasAffiliatedDiscount.set(false);
              // Só aplica 100% desconto se tiver horas suficientes
              this.hasFreeCourses.set(this.availableHours() >= this.cartTotalHours());
            } else if (user.parceiro.isParceiro === false) {
              // REGRA 2B: Parceiro conveniado (isParceiro = false) - 10% DESCONTO
              this.hasAffiliatedDiscount.set(true);
              this.hasFreeCourses.set(false);
            }
          }
        }

        if (coupon) {
          this.couponDiscount.update(() => coupon);
          this.store.dispatch(LoadingAction.loading({ message: false }));
          this.ref?.close();
        }

        // DEFINIR PERCENTUAL DE DESCONTO BASEADO NAS REGRAS
        this.discountPercent.update(() => {
          if (this.hasFreeCourses()) {
            return 1; // 100% desconto (gratuidade)
          } else if (this.hasAffiliatedDiscount()) {
            return 0.1; // 10% desconto para conveniados
          } else {
            return Number(discountPercent) / 100; // Outros descontos
          }
        });

        const couponValue = this.couponDiscount()?.valor || 0;
        const couponDiscountAmount = Number((this.totalPrice() * couponValue) / 100) || 0;

        this.calculateTotalPayment(
          this.totalPrice(),
          couponDiscountAmount,
          this.discountPercent()
        );
        
        this.store.dispatch(
          CheckoutActions.selectTotalPayment({ total: this.total() })
        );

        this.changeDetectorRef.markForCheck();
      }
    );
  }

  checkCurrentRoute(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.router.url;
        if (currentRoute !== '/carrinho-de-compras') {
          this.disabledCouponButton.update(() => true);
        }
      });
  }

  handleCouponModal(): void {
    this.ref = this.dialogService.open(CouponComponent, {
      header: 'Cupom',
      contentStyle: { overflow: 'auto' },
      styleClass: 'w-10 sm:w-9 mg:w-7 lg:w-5',
      baseZIndex: 10000,
      maximizable: false
    });
  }

  private calculateTotalPayment(
    total: number,
    couponDiscount: number,
    discountPercent: number
  ): void {
    if (this.hasFreeCourses()) {
      // Se os cursos são gratuitos, total = 0
      this.total.set(0);
      return;
    }

    // Cálculo normal para quando não são gratuitos
    const priceAfterCoupon = total - couponDiscount;
    const discountAmount = priceAfterCoupon * discountPercent;
    const finalPrice = priceAfterCoupon - discountAmount;
    
    this.total.set(Math.max(0, finalPrice)); // Garante que não seja negativo
  }

  ngOnDestroy(): void {
    if (this.ref) this.ref.close();
  }
}