import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import {
  AsyncPipe,
  CurrencyPipe,
  NgClass,
  NgIf,
  PercentPipe,
  TitleCasePipe
} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartType } from '@shared/models/classes/cart-market.model';
import {
  cartItemsSelector,
  cartTotalHoursSelector,
  cartTotalPriceSelector
} from '@shared/store/reducers/cart.reducer';
import { CartActions } from '@shared/store/actions/cart.actions';
import { CardNavigationActions } from '@shared/store/actions/card-navigation.actions';
import { NoImageComponent } from '@shared/components/NoImage';
import { CourseTypeEnum } from '@shared/models/enum/course-type.enum';
import { OrderModel } from '@shared/models/classes/order.model';
import { OrderActions } from '@shared/store/actions/order.actions';
import {
  userDetailsDiscountSelect,
  userDetailsSelect
} from '@shared/store/reducers/user-details.reducer';
import { checkoutTotalPaymentSelect } from '@shared/store/reducers/checkout.reducer';

import { combineLatest } from 'rxjs';

import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { Store } from '@ngrx/store';
import { ConfirmationService, Message } from 'primeng/api';

import { QuoteSummaryComponent } from '../QuoteSummary';
import { GetDirectoryImage } from '../../../shared/pipes/convert-base64.pipe';

@Component({
  selector: 'page-cart',
  standalone: true,
  template: `
    <div
      *ngIf="items?.length; else noItems"
      class="w-full border-round-lg shadow-1 max-w-62rem m-auto bg-white"
    >
      <div class="w-full ">
        <div class="w-full flex py-4 bg-amber-50 border border-amber-200 rounded-lg mb-4 shadow-sm">
          <div class="w-full flex items-center justify-center px-4">
            <div class="w-full flex flex-column gap-3">
              <div class="w-full flex py-4 px-4 bg-red-100 border border-red-300 rounded-lg items-center">
                <i class="pi pi-exclamation-triangle text-red-500 mr-3 text-lg"></i>
                <p class="text-center font-medium text-red-800 text-sm m-0">
                  <strong>Importante:</strong> Você está adquirindo o direito de uso do curso por 6 meses a partir da data da compra.
                </p>
              </div>
              
              <!-- Exibir apenas para parceiros NÃO conveniados (isParceiro = true) -->
              <div 
                *ngIf="showPartnerMessage()"
                class="w-full flex py-4 px-4 bg-yellow-100 border border-yellow-300 rounded-lg items-center"
              >
                <i class="pi pi-info-circle text-green-600 mr-3 text-lg"></i>
                <p class="text-center font-medium text-amber-800 text-sm m-0">
                  Você é filiado ao parceiro <strong>{{ partnerName() }}</strong> e possui 
                  <strong>{{ availableHours() }} horas</strong> gratuitas disponíveis.
                </p>              
              </div>

              <!-- Exibir mensagem para conveniados (isParceiro = false) -->
              <div 
                *ngIf="isAffiliatedPartner() && !isNonAffiliatedPartner()"
                class="w-full flex py-4 px-4 bg-blue-100 border border-blue-300 rounded-lg items-center"
              >
                <i class="pi pi-info-circle text-blue-600 mr-3 text-lg"></i>
                <p class="text-center font-medium text-blue-800 text-sm m-0">
                  Você é um conveniado do parceiro <strong>{{ partnerName() }}</strong> e possui 
                  <strong>10% de desconto</strong> em sua compra.
                </p>              
              </div>
            </div>
          </div>
        </div>

        <p-table [value]="items" [tableStyle]="{ 'min-width': '30rem' }">
          <ng-template pTemplate="header">
            <tr class="text-xs text-center">
              <th class="col-8">Curso</th>
              <th class="w-1 text-center ">Preço</th>
              <th class="text-center ">
                Desconto <br />
                EcoCursos
              </th>
              <th class="text-center w-1">
                Desconto <br />
                Parceiro
              </th>
              <th class="w-1">Valor final</th>
              <th class="">
                <p-button
                  (onClick)="clearAllItems($event)"
                  icon="pi pi-replay"
                  [rounded]="true"
                  size="small"
                  severity="danger"
                />
              </th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-item>
            <tr class="text-sm">
              <td class="flex gap-3">
                <div class="w-10rem h-6rem" *ngIf="item.capa; else noImage">
                  <img
                    class="w-full w-10rem h-full shadow-3 border-round-xl image-content"
                    [src]="item.capa | directory_image"
                    [alt]="item.titulo"
                  />
                </div>
                <div class="flex flex-column gap-2">
                  <p class="font-bold m-0">{{ item.titulo }}</p>
                  <p class="text-sm text-600 m-0">
                    {{ categoryType(item.tipoCurso) }}
                  </p>
                  <p class="text-sm text-600 m-0">
                    Carga horária:
                    <strong>{{ item.cargaHoraria }}</strong> horas
                  </p>
                  <p class="text-sm text-600 m-0">
                    Categoria: {{ item.categoria.titulo }}
                  </p>
                </div>
              </td>

              <td class="'text-600'">{{ (item.preco | currency) ?? '-' }}</td>

              <td>{{ ('0' | percent) ?? '-' }}</td>
              <td [ngClass]="shouldApplyFreeDiscount(item) ? 'text-green-600' : 'text-600'">
                {{ getDiscountText(item) }}
              </td>
              <td class="font-bold">
                {{ calculateFinalValueItem(item) | currency }}
              </td>
              <td class="col-1">
                <p-confirmPopup />
                <p-button
                  icon="pi pi-trash"
                  class="text-sm"
                  [rounded]="true"
                  [text]="true"
                  size="small"
                  severity="danger"
                  (onClick)="deleteItemFromCart($event, item)"
                />
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="summary">
            <div class=" flex flex-wrap flex-row justify-content-end gap-3">
              <div
                class="flex line-height-4 font-normal
                flex-column align-items-start md:align-items-end
                justify-content-between text-lg"
              >
                <small
                  >{{ items?.length }}
                  {{ items.length > 1 ? 'cursos' : 'curso' }}, totalizando
                  <strong>{{ this.totalHours() }}</strong> horas de
                  estudo</small
                >
              </div>
            </div>

            <p-divider />

            <div class="w-full flex justify-content-between">
              <p-button
                routerLink="/categorias"
                class="text-sm"
                icon="pi pi-money-bill"
                styleClass="p-button-link text-sm"
                [link]="true"
                [size]="'small'"
                label="Continuar comprando"
              />
              <p-button
                icon="pi pi-dollar"
                (onClick)="closeOrder()"
                styleClass="p-button-sm"
                label="Fechar pedido"
                [size]="'small'"
                [disabled]="disabledButton()"
              />
            </div>
          </ng-template>
        </p-table>
      </div>
    </div>

    <ng-template #noItems>
      <div
        class="shadow-1 flex flex-1 flex-shrink-1 flex-column align-items-center
        justify-content-center bg-white max-w-62rem m-auto p-8 border-round-2xl"
      >
        <i class="mb-3 text-7xl pi pi-shopping-cart"></i>
        <div class="text-left flex flex-column">
          <span class="mb-2 text-2xl text-800"
            >Crie um carrinho com cursos!</span
          >
          <span class="text-lg text-600"
            >Adicione cursos e garanta discontos.</span
          >
        </div>
        <div class="mt-5 w-22rem">
          <p-button
            styleClass="w-full"
            label="Ver cursos"
            routerLink="/categorias"
          />
        </div>
      </div>
    </ng-template>

    <ng-template #noImage>
      <app-no-image class="max-w-5rem" />
    </ng-template>
  `,
  imports: [
    TitleCasePipe,
    TableModule,
    AsyncPipe,
    RatingModule,
    CurrencyPipe,
    PercentPipe,
    FormsModule,
    TagModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    RouterLink,
    NgIf,
    NgClass,
    QuoteSummaryComponent,
    NoImageComponent,
    ConfirmPopupModule,
    GetDirectoryImage
  ],
  styles: [
    `
      .image-content {
        display: block;
        height: 100%;
        object-fit: cover;
        object-position: top;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [ConfirmationService]
})
export class CartPageComponent implements OnInit, AfterContentInit {
  items: CartType[];
  messages: Message[];
  pageName = 'Meu carrinho de compras';

  private store = inject(Store);
  private confirmationService = inject(ConfirmationService);

  userId: number;
  discountMoney = 0;
  mountOrder1 = new OrderModel();

  availableHours = signal<number>(0);
  disabledButton = signal<boolean>(false);
  totalFinalValue = signal<number>(0);
  cartSubTotalPrice = signal<number>(0);
  mountOrder = signal(new OrderModel());
  totalFinalValueItem = signal<number>(0);
  totalHours: WritableSignal<number> = signal<number>(0);
  discountPercent: WritableSignal<number> = signal<number>(0);
  discountValue = computed(
    () => this.cartSubTotalPrice() * this.discountPercent()
  );

  partnerName = signal<string>('');
  isAffiliatedPartner = signal<boolean>(false); // Conveniado (isParceiro = false)
  isNonAffiliatedPartner = signal<boolean>(false); // Não conveniado (isParceiro = true)
  hasFreeCourses = signal<boolean>(false);
  isAllLawOnlineCourses = signal<boolean>(false);

  ngOnInit(): void {
    this.getStateDataValues();
  }

  ngAfterContentInit(): void {
    this.store.dispatch(CardNavigationActions.enter());
    this.store.dispatch(
      CardNavigationActions.selectPage({ page: this.pageName })
    );
  }

  getStateDataValues(): void {
    combineLatest([
      this.store.select(cartItemsSelector),
      this.store.select(cartTotalHoursSelector),
      this.store.select(userDetailsSelect),
      this.store.select(checkoutTotalPaymentSelect),
      this.store.select(userDetailsDiscountSelect),
      this.store.select(cartTotalPriceSelector)
    ]).subscribe(
      ([
        cartItems,
        cartTotalHours,
        userDetails,
        checkoutTotalPayment,
        userDetailsDiscount,
        cartSubTotalPrice
      ]) => {
        this.items = cartItems;
        this.totalHours.update(() => cartTotalHours);
        this.cartSubTotalPrice.update(() => cartSubTotalPrice);
  
        if (userDetails) {
          userDetails.forEach(res => {
            this.userId = res.id;
            this.availableHours.set(res.horasDisponiveis);
            
            // Verificar tipo de parceiro
            if (res.parceiro) {
              this.partnerName.set(res.parceiro.nome || '');
              
              // isParceiro = false → Conveniado (apenas desconto de 10%)
              // isParceiro = true → Não conveniado (horas gratuitas)
              this.isAffiliatedPartner.set(res.parceiro.isParceiro === false);
              this.isNonAffiliatedPartner.set(res.parceiro.isParceiro === true);
            }
          });
        }

        // Verificar se todos os cursos são da categoria DIREITO ONLINE (ID 3)
        this.isAllLawOnlineCourses.update(() => {
          return this.items.every(item => item.categoria.id === 3);
        });
  
        // Verificar se os cursos são gratuitos (apenas para não conveniados)
        this.hasFreeCourses.update(() => {
          return this.isNonAffiliatedPartner() && 
                 this.isAllLawOnlineCourses() && 
                 this.totalHours() <= this.availableHours();
        });
  
        // Definir percentual de desconto
        this.discountPercent.update(() => {
          if (this.hasFreeCourses()) {
            return 1; // 100% de desconto para cursos gratuitos
          } else if (this.isAffiliatedPartner()) {
            return 0.1; // 10% de desconto para conveniados
          } else {
            return Number(userDetailsDiscount) / 100; // Desconto padrão
          }
        });
  
        if (checkoutTotalPayment) {
          this.totalFinalValue.update(() => checkoutTotalPayment);
        }
      }
    );
  }

  // Exibir mensagem apenas para parceiros NÃO conveniados
  showPartnerMessage(): boolean {
    return this.isNonAffiliatedPartner() && this.partnerName() !== '';
  }

  deleteItemFromCart(event: Event, item: CartType): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja excluir esse item?',
      icon: 'pi pi-exclamation-triangle',
      accept: () =>
        this.store.dispatch(CartActions.removeItemToCart({ item: item }))
    });
  }

  clearAllItems(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja excluir todos os itens do carrinho?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.store.dispatch(CartActions.clearAllItemsToCart())
    });
  }

  categoryType(type: number): string {
    return CourseTypeEnum[type];
  }

  shouldApplyFreeDiscount(item: CartType): boolean {
    return this.hasFreeCourses() && item.categoria.id === 3;
  }

  getDiscountText(item: CartType): string {
    if (this.shouldApplyFreeDiscount(item)) {
      return '-100%';
    } else if (this.isAffiliatedPartner()) {
      return '10%';
    } else {
      return (this.discountPercent() * 100) + '%';
    }
  }

  calculateFinalValueItem(item: CartType): number {
    if (this.shouldApplyFreeDiscount(item)) {
      return 0; // Curso gratuito para não conveniados
    }
    
    // Aplicar desconto de 10% apenas para conveniados
    const discount = this.isAffiliatedPartner() ? this.discountPercent() : 0;
    return item.preco - item.preco * discount;
  }

  closeOrder(): void {
    const isFreeOrder = this.hasFreeCourses();
    
    const mock: OrderModel = {
      aluno: {
        id: this.userId
      },
      cursos: this.items.map(res => {
        return { id: res.id };
      }),
      status: 1, // Status 1 para pedido criado
      tipoPagamentos: isFreeOrder ? [0] : [1, 2, 3],
      subtotal: this.cartSubTotalPrice(),
      descontos: isFreeOrder ? this.cartSubTotalPrice() : (this.isAffiliatedPartner() ? this.discountValue() : 0),
      isento: isFreeOrder ? 1 : 0,
      taxaMatricula: isFreeOrder ? 0 : 50
    };

    console.log('Pedido a ser enviado:', mock);
    console.log('Tipos de pagamento definidos:', mock.tipoPagamentos);
    console.log('É compra gratuita?', isFreeOrder);
    console.log('É conveniado?', this.isAffiliatedPartner());
    console.log('É não conveniado?', this.isNonAffiliatedPartner());

    this.store.dispatch(OrderActions.selectOrder({ order: mock }));
  }
}