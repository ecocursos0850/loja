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
  userDetailsPartner
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
        
        <div *ngIf="hasFreeCourses()" class="line-height-4 flex justify-content-between text-green-600">
          <strong>Desconto Parceiro (Horas Gratuitas)</strong>
          <span>-100%</span>
        </div>
        
        <div
          *ngIf="!hasFreeCourses()"
          [ngClass]="hasFreeCourses() ? 'text-gray-400' : ''"
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
  isPartner = signal<boolean>(false);
  availableHours = signal<number>(0);
  cartTotalHours = signal<number>(0);

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
      this.store.select(userDetailsPartner)
    ]).subscribe(
      ([
        totalPrice,
        items,
        coupon,
        discountPercent,
        availableHours,
        cartTotalHours,
        userDetailsPartner
      ]) => {
        this.totalPrice.update(() => totalPrice);
        this.totalItems.set(items.length);
        this.availableHours.set(availableHours || 0);
        this.cartTotalHours.set(cartTotalHours);

        // Verificar se é parceiro
        this.isPartner.set(userDetailsPartner !== null && userDetailsPartner !== undefined);

        // Lógica corrigida para determinar se os cursos são gratuitos
        this.hasFreeCourses.update(() => {
          return this.isPartner() && 
                 this.availableHours() > 0 && 
                 this.cartTotalHours() <= this.availableHours();
        });

        if (coupon) {
          this.couponDiscount.update(() => coupon);
          this.store.dispatch(LoadingAction.loading({ message: false }));
          this.ref?.close();
        }

        this.discountPercent.update(() => {
          return this.hasFreeCourses() ? 1 : Number(discountPercent) / 100;
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

  isAllLawOnline(courses: CartType[]): boolean {
    return courses.every(
      course => course.categoria.titulo === 'DIREITO ONLINE'
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
    const finalPrice = priceAfterCoupon - (priceAfterCoupon * discountPercent);
    
    this.total.set(Math.max(0, finalPrice)); // Garante que não seja negativo
  }

  ngOnDestroy(): void {
    if (this.ref) this.ref.close();
  }
}