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

import { combineLatest, filter, take } from 'rxjs';

import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { AnimateModule } from 'primeng/animate';
import { Store } from '@ngrx/store';
import { InplaceModule } from 'primeng/inplace';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

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
        
        <!-- Desconto 100% para parceiros NÃO conveniados com horas suficientes (DIREITO ONLINE) -->
        <div *ngIf="hasFreeCourses()" class="line-height-4 flex justify-content-between text-green-600">
          <strong>Desconto Parceiro (Horas Gratuitas)</strong>
          <span>- {{ freeCoursesDiscountValue() | currency }}</span>
          <div class="text-xs text-red-600">
            Aplicável apenas para cursos Direito Online
          </div>
        </div>
        
        <!-- Desconto de 10% para parceiros conveniados (DIREITO ONLINE) -->
        <div *ngIf="hasAffiliatedDiscount() && !hasFreeCourses()" class="line-height-4 flex justify-content-between text-blue-600">
          <strong>Desconto Parceiro (10%)</strong>
          <span>- {{ affiliatedDiscountValue() | currency }}</span>
          <div class="text-xs text-red-600">
            Aplicável apenas para cursos Direito Online
          </div>
        </div>

        <!-- Desconto para PÓS-GRADUAÇÃO / MBA -->
        <div *ngIf="hasPosGraduacaoDiscount()" class="line-height-4 flex justify-content-between text-purple-600">
          <strong>Desconto Pós-Graduação/MBA ({{ getPosGraduacaoDiscountPercent() }}%)</strong>
          <span>- {{ posGraduacaoDiscountValue() | currency }}</span>
        </div>

        <!-- Cupom de desconto -->
        <ng-container
          *ngIf="
            !hasCouponDiscount();
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

      <!-- Detalhamento dos valores -->
      <div *ngIf="showPriceBreakdown()" class="mt-3 p-3 bg-blue-50 border-round">
        <div class="text-sm">
          <strong>Detalhamento do Valor:</strong>
          <div class="flex justify-content-between">
            <span>Cursos outras categorias:</span>
            <span>{{ otherCategoriesTotal() | currency }}</span>
          </div>
          <div *ngIf="hasAnyDireitoOnlineCourse()" class="flex justify-content-between">
            <span>Cursos Direito Online:</span>
            <span>{{ direitoOnlineSubtotal() | currency }}</span>
          </div>
          <div *ngIf="hasAnyPosGraduacaoCourse()" class="flex justify-content-between">
            <span>Cursos Pós-Graduação/MBA:</span>
            <span>{{ posGraduacaoSubtotal() | currency }}</span>
          </div>
          <div *ngIf="hasAffiliatedDiscount() && !hasFreeCourses()" class="flex justify-content-between text-blue-600">
            <span>Desconto 10% Direito Online:</span>
            <span>- {{ affiliatedDiscountValue() | currency }}</span>
          </div>
          <div *ngIf="hasFreeCourses()" class="flex justify-content-between text-green-600">
            <span>Desconto 100% Direito Online:</span>
            <span>- {{ freeCoursesDiscountValue() | currency }}</span>
          </div>
          <div *ngIf="hasPosGraduacaoDiscount()" class="flex justify-content-between text-purple-600">
            <span>Desconto {{ getPosGraduacaoDiscountPercent() }}% Pós-Graduação:</span>
            <span>- {{ posGraduacaoDiscountValue() | currency }}</span>
          </div>
          <div *ngIf="hasCouponDiscount()" class="flex justify-content-between text-orange-600">
            <span>Desconto Cupom ({{ getCouponDiscountPercent() }}%):</span>
            <span>- {{ getCouponDiscountValue() | currency }}</span>
          </div>
          <div class="flex justify-content-between font-bold">
            <span>Total a pagar:</span>
            <span>{{ total() | currency }}</span>
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
        class="flex justify-content-between text-orange-600"
      >
        <strong> Cupom de desconto </strong>
        <span>- {{ getCouponDiscountPercent() }} %</span>
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
  private messageService = inject(MessageService);

  ref: DynamicDialogRef | undefined;
  private subscription: any;

  totalPrice = signal<number>(0);
  totalItems = signal<number>(0);
  total = signal<number>(0);
  couponDiscount = signal<DiscountCouponType | null>(null);
  showButtonBack = signal<boolean>(true);
  disabledCouponButton = signal<boolean>(false);
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

  // Novos signals para cálculo detalhado
  direitoOnlineSubtotal = signal<number>(0);
  posGraduacaoSubtotal = signal<number>(0);
  otherCategoriesTotal = signal<number>(0);
  freeCoursesDiscountValue = signal<number>(0);
  affiliatedDiscountValue = signal<number>(0);
  posGraduacaoDiscountValue = signal<number>(0);
  couponDiscountValue = signal<number>(0);

  // Método para verificar se um curso é da categoria Direito Online
  private isDireitoOnlineCourse(item: CartType): boolean {
    return item.categoria?.titulo?.toLowerCase().includes('direito online');
  }

  // Método para verificar se um curso é da categoria PÓS-GRADUAÇÃO / MBA
  private isPosGraduacaoCourse(item: CartType): boolean {
    const categoria = item.categoria?.titulo?.toLowerCase() || '';
    return categoria.includes('pós-graduação') || categoria.includes('mba') || categoria.includes('pos-graduacao');
  }

  // Verificar se há pelo menos um curso Direito Online no carrinho
  hasAnyDireitoOnlineCourse(): boolean {
    return this.cartItems()?.some(item => this.isDireitoOnlineCourse(item)) ?? false;
  }

  // Verificar se há pelo menos um curso PÓS-GRADUAÇÃO no carrinho
  hasAnyPosGraduacaoCourse(): boolean {
    return this.cartItems()?.some(item => this.isPosGraduacaoCourse(item)) ?? false;
  }

  // Verificar se tem desconto para PÓS-GRADUAÇÃO
  hasPosGraduacaoDiscount(): boolean {
    return this.hasPartner() && this.hasAnyPosGraduacaoCourse();
  }

  // Obter percentual de desconto para PÓS-GRADUAÇÃO
  getPosGraduacaoDiscountPercent(): number {
    if (this.isNonAffiliatedPartner()) {
      return 20;
    } else if (this.isAffiliatedPartner()) {
      return 10;
    }
    return 0;
  }

  // Verificar se há cupom de desconto aplicado
  hasCouponDiscount(): boolean {
    const coupon = this.couponDiscount();
    return !!(coupon && coupon.valor !== undefined && coupon.valor !== null && coupon.valor > 0);
  }

  // Obter percentual do cupom
  getCouponDiscountPercent(): number {
    const coupon = this.couponDiscount();
    return coupon?.valor || 0;
  }

  // Calcular horas totais apenas dos cursos Direito Online
  private calculateDireitoOnlineTotalHours(): number {
    return this.cartItems()
      ?.filter(item => this.isDireitoOnlineCourse(item))
      ?.reduce((total, item) => total + (item.cargaHoraria || 0), 0) ?? 0;
  }

  // Calcular subtotal apenas dos cursos Direito Online
  private calculateDireitoOnlineSubtotal(): number {
    return this.cartItems()
      ?.filter(item => this.isDireitoOnlineCourse(item))
      ?.reduce((total, item) => total + (item.preco || 0), 0) ?? 0;
  }

  // Calcular subtotal apenas dos cursos PÓS-GRADUAÇÃO
  private calculatePosGraduacaoSubtotal(): number {
    return this.cartItems()
      ?.filter(item => this.isPosGraduacaoCourse(item))
      ?.reduce((total, item) => total + (item.preco || 0), 0) ?? 0;
  }

  // Calcular total dos cursos de outras categorias
  private calculateOtherCategoriesTotal(): number {
    return this.cartItems()
      ?.filter(item => !this.isDireitoOnlineCourse(item) && !this.isPosGraduacaoCourse(item))
      ?.reduce((total, item) => total + (item.preco || 0), 0) ?? 0;
  }

  // Verificar se as horas disponíveis cobrem os cursos Direito Online
  hasEnoughHoursForDireitoOnline(): boolean {
    return this.availableHours() >= this.direitoOnlineTotalHours();
  }

  // Verificar se o usuário tem parceiro
  hasPartner(): boolean {
    return !this.isRegularUser();
  }

  // Mostrar detalhamento de preços quando aplicável
  showPriceBreakdown(): boolean {
    return this.hasAnyDireitoOnlineCourse() || 
           this.hasAnyPosGraduacaoCourse() || 
           this.hasCouponDiscount();
  }

  // Calcular valor do desconto do cupom para exibição
  getCouponDiscountValue(): number {
    return this.couponDiscountValue();
  }

  ngOnInit(): void {
    this.getCartData();
    this.checkCurrentRoute();
  }

  getCartData(): void {
    // Usar take(1) para evitar múltiplas subscriptions
    this.subscription = combineLatest([
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
        try {
          console.log('🛒 Cart data updated - Quote Summary');
          
          this.totalPrice.set(totalPrice || 0);
          this.totalItems.set(items?.length || 0);
          this.cartItems.set(items || []);
          this.availableHours.set(availableHours || 0);
          this.cartTotalHours.set(cartTotalHours || 0);
          
          // CALCULAR VALORES DETALHADOS
          this.direitoOnlineTotalHours.set(this.calculateDireitoOnlineTotalHours());
          this.direitoOnlineSubtotal.set(this.calculateDireitoOnlineSubtotal());
          this.posGraduacaoSubtotal.set(this.calculatePosGraduacaoSubtotal());
          this.otherCategoriesTotal.set(this.calculateOtherCategoriesTotal());

          // RESETAR ESTADOS
          this.isRegularUser.set(true);
          this.hasFreeCourses.set(false);
          this.hasAffiliatedDiscount.set(false);
          this.isNonAffiliatedPartner.set(false);
          this.isAffiliatedPartner.set(false);
          this.partnerName.set('');

          // VERIFICAÇÃO DO TIPO DE USUÁRIO
          if (userDetails && userDetails.length > 0) {
            const user = userDetails[0];
            
            if (!user.parceiro) {
              this.isRegularUser.set(true);
            }
            else if (user.parceiro) {
              this.isRegularUser.set(false);
              this.partnerName.set(user.parceiro.nome || '');
              
              if (user.parceiro.isParceiro === true) {
                this.isNonAffiliatedPartner.set(true);
                this.isAffiliatedPartner.set(false);
                this.hasAffiliatedDiscount.set(false);
                this.hasFreeCourses.set(
                  this.hasEnoughHoursForDireitoOnline() && 
                  this.hasAnyDireitoOnlineCourse()
                );
              } else if (user.parceiro.isParceiro === false) {
                this.isNonAffiliatedPartner.set(false);
                this.isAffiliatedPartner.set(true);
                this.hasAffiliatedDiscount.set(this.hasAnyDireitoOnlineCourse());
                this.hasFreeCourses.set(false);
              }
            }
          }

          // CALCULAR VALORES DE DESCONTO
          if (this.hasFreeCourses()) {
            this.freeCoursesDiscountValue.set(this.direitoOnlineSubtotal());
          } else if (this.hasAffiliatedDiscount()) {
            this.affiliatedDiscountValue.set(this.direitoOnlineSubtotal() * 0.1);
          }

          if (this.hasPosGraduacaoDiscount()) {
            const discountPercent = this.getPosGraduacaoDiscountPercent() / 100;
            this.posGraduacaoDiscountValue.set(this.posGraduacaoSubtotal() * discountPercent);
          }

          // TRATAMENTO DO CUPOM - Simplificado
          this.handleCouponUpdate(coupon);

          // SEMPRE recalcular o pagamento
          this.calculateTotalPayment();
          
          // Atualizar store com o total calculado
          this.store.dispatch(
            CheckoutActions.selectTotalPayment({ total: this.total() })
          );

          this.changeDetectorRef.detectChanges();
        } catch (error) {
          console.error('❌ Error in quote summary calculation:', error);
        }
      },
      (error) => {
        console.error('❌ Error in cart data subscription:', error);
        this.store.dispatch(LoadingAction.loading({ message: false }));
      }
    );
  }

  private handleCouponUpdate(coupon: any): void {
    if (coupon && typeof coupon === 'object' && coupon.valor !== undefined && coupon.valor !== null && coupon.valor > 0) {
      console.log('✅ Valid coupon found:', coupon);
      this.couponDiscount.set(coupon as DiscountCouponType);
      
      // Mostrar mensagem de sucesso apenas se for uma nova aplicação
      if (!this.hasCouponDiscount()) {
        this.messageService.add({
          severity: 'success',
          summary: 'Cupom aplicado!',
          detail: `Desconto de ${coupon.valor}% aplicado com sucesso.`,
          life: 3000
        });
      }
    } else {
      console.log('ℹ️  No valid coupon');
      this.couponDiscount.set(null);
      this.couponDiscountValue.set(0);
    }

    // Fechar loading e dialog
    this.store.dispatch(LoadingAction.loading({ message: false }));
    if (this.ref) {
      this.ref.close();
    }
  }

  checkCurrentRoute(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.router.url;
        this.disabledCouponButton.set(currentRoute !== '/carrinho-de-compras');
      });
  }

  handleCouponModal(): void {
    this.ref = this.dialogService.open(CouponComponent, {
      header: 'Cupom de Desconto',
      contentStyle: { overflow: 'auto' },
      styleClass: 'w-10 sm:w-9 mg:w-7 lg:w-5',
      baseZIndex: 10000,
      maximizable: false
    });

    this.ref.onClose.subscribe((result) => {
      console.log('🎫 Coupon dialog closed');
      this.changeDetectorRef.detectChanges();
    });
  }

  private calculateTotalPayment(): void {
    try {
      let totalCalculado = this.totalPrice();
    
      // 1) aplica regras de desconto de parceiro / pós
      if (this.hasFreeCourses()) {
        totalCalculado =
          this.otherCategoriesTotal() +
          (this.posGraduacaoSubtotal() - this.posGraduacaoDiscountValue());
      } else if (this.hasAffiliatedDiscount() || this.hasPosGraduacaoDiscount()) {
        totalCalculado =
          this.otherCategoriesTotal() +
          (this.direitoOnlineSubtotal() - this.affiliatedDiscountValue()) +
          (this.posGraduacaoSubtotal() - this.posGraduacaoDiscountValue());
      }
    
      // 2) aplica cupom de desconto sobre o total já calculado
      const totalAntesCupom = totalCalculado;
      totalCalculado = this.applyCouponDiscount(totalCalculado);
      
      // Atualiza o valor do desconto do cupom para exibição
      const descontoCupom = totalAntesCupom - totalCalculado;
      this.couponDiscountValue.set(descontoCupom);
    
      // 3) atualiza o signal do total
      this.total.set(totalCalculado);
    } catch (error) {
      console.error('❌ Error in calculateTotalPayment:', error);
      this.total.set(this.totalPrice());
    }
  }
  
  private applyCouponDiscount(total: number): number {
    if (!this.hasCouponDiscount()) {
      return total;
    }

    const coupon = this.couponDiscount();
    const percentual = coupon!.valor!;
    
    if (percentual <= 0 || percentual > 100) {
      return total;
    }
  
    const desconto = (percentual / 100) * total;
    const totalComDesconto = total - desconto;
    
    return Math.max(0, totalComDesconto);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.ref) {
      this.ref.close();
    }
  }
}
