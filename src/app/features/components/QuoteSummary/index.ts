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
          <div class="text-xs text-red-600">
            Aplicável apenas para cursos Direito Online
          </div>
        </div>
        
        <!-- Desconto de 10% para parceiros conveniados -->
        <div *ngIf="hasAffiliatedDiscount() && !hasFreeCourses()" class="line-height-4 flex justify-content-between text-blue-600">
          <strong>Desconto Parceiro</strong>
          <span>-10%</span>
          <div class="text-xs text-red-600">
            Aplicável apenas para cursos Direito Online
          </div>
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

      <!-- Informações sobre horas -->
      <div *ngIf="hasAnyDireitoOnlineCourse() && hasPartner()" class="mt-3 p-3 bg-gray-100 border-round">
        <div class="text-sm">
          <strong>Informações de Horas (Apenas Direito Online):</strong>
          <div>Horas disponíveis: {{ availableHours() }}h</div>
          <div>Horas Direito Online: {{ direitoOnlineTotalHours() }}h</div>
          <div [ngClass]="hasEnoughHoursForDireitoOnline() ? 'text-green-600' : 'text-red-600'">
            Status: {{ hasEnoughHoursForDireitoOnline() ? 'SUFICIENTES' : 'INSUFICIENTES' }}
          </div>
          <div *ngIf="isNonAffiliatedPartner() && hasEnoughHoursForDireitoOnline()" class="text-green-600 font-bold">
            ✅ Cursos Direito Online serão gratuitos
          </div>
          <div *ngIf="isNonAffiliatedPartner() && !hasEnoughHoursForDireitoOnline()" class="text-red-600 font-bold">
            ❌ Cursos Direito Online serão cobrados (horas insuficientes)
          </div>
        </div>
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
  isNonAffiliatedPartner = signal<boolean>(false);
  availableHours = signal<number>(0);
  cartTotalHours = signal<number>(0);
  partnerName = signal<string>('');
  cartItems = signal<CartType[]>([]);
  direitoOnlineTotalHours = signal<number>(0);

  // Novo método para verificar se um curso é da categoria Direito Online
  private isDireitoOnlineCourse(item: CartType): boolean {
    return item.categoria?.titulo?.toLowerCase().includes('direito online');
  }

  // Verificar se há pelo menos um curso Direito Online no carrinho
  hasAnyDireitoOnlineCourse(): boolean {
    return this.cartItems()?.some(item => this.isDireitoOnlineCourse(item)) ?? false;
  }

  // Calcular horas totais apenas dos cursos Direito Online
  private calculateDireitoOnlineTotalHours(): number {
    return this.cartItems()
      ?.filter(item => this.isDireitoOnlineCourse(item))
      ?.reduce((total, item) => total + (item.cargaHoraria || 0), 0) ?? 0;
  }

  // Verificar se as horas disponíveis cobrem os cursos Direito Online
  hasEnoughHoursForDireitoOnline(): boolean {
    return this.availableHours() >= this.direitoOnlineTotalHours();
  }

  // Verificar se o usuário tem parceiro
  hasPartner(): boolean {
    return !this.isRegularUser();
  }

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
        this.cartItems.set(items);
        this.availableHours.set(availableHours || 0);
        this.cartTotalHours.set(cartTotalHours);
        
        // CALCULAR HORAS APENAS DOS CURSOS DIREITO ONLINE
        this.direitoOnlineTotalHours.set(this.calculateDireitoOnlineTotalHours());

        // RESETAR ESTADOS
        this.isRegularUser.set(true);
        this.hasFreeCourses.set(false);
        this.hasAffiliatedDiscount.set(false);
        this.isNonAffiliatedPartner.set(false);
        this.partnerName.set('');

        // VERIFICAÇÃO DO TIPO DE USUÁRIO
        if (userDetails && userDetails.length > 0) {
          const user = userDetails[0];
          
          // REGRA 1: Usuário regular (sem parceiro) - SEM DESCONTO
          if (!user.parceiro) {
            this.isRegularUser.set(true);
            this.hasFreeCourses.set(false);
            this.hasAffiliatedDiscount.set(false);
            this.isNonAffiliatedPartner.set(false);
            this.partnerName.set('');
          }
          // REGRA 2: Usuário com parceiro
          else if (user.parceiro) {
            this.isRegularUser.set(false);
            this.partnerName.set(user.parceiro.nome || '');
            
            if (user.parceiro.isParceiro === true) {
              // REGRA 2A: Parceiro NÃO conveniado (isParceiro = true) - HORAS GRATUITAS
              this.isNonAffiliatedPartner.set(true);
              this.hasAffiliatedDiscount.set(false);
              // Só aplica gratuidade se houver cursos Direito Online E horas suficientes
              this.hasFreeCourses.set(
                this.hasEnoughHoursForDireitoOnline() && 
                this.hasAnyDireitoOnlineCourse()
              );
            } else if (user.parceiro.isParceiro === false) {
              // REGRA 2B: Parceiro conveniado (isParceiro = false) - 10% DESCONTO
              this.isNonAffiliatedPartner.set(false);
              this.hasAffiliatedDiscount.set(this.hasAnyDireitoOnlineCourse());
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
        // IMPORTANTE: O desconto só se aplica aos cursos Direito Online
        this.discountPercent.update(() => {
          if (this.hasFreeCourses()) {
            return 1; // 100% desconto (gratuidade) - APENAS para Direito Online
          } else if (this.hasAffiliatedDiscount()) {
            return 0.1; // 10% desconto para conveniados - APENAS para Direito Online
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