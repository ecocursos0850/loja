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
              
              <!-- Mensagem para parceiros NÃO conveniados (isParceiro = true) - HORAS GRATUITAS -->
              <div 
                *ngIf="showPartnerFreeHoursMessage()"
                class="w-full flex py-4 px-4 bg-yellow-100 border border-yellow-300 rounded-lg items-center"
              >
                <i class="pi pi-info-circle text-green-600 mr-3 text-lg"></i>
                <p class="text-center font-medium text-amber-800 text-sm m-0">
                  Você é filiado ao parceiro <strong>{{ partnerName() }}</strong> e possui 
                  <strong>{{ availableHours() }} horas</strong> gratuitas disponíveis.
                </p>              
              </div>

              <!-- Mensagem para parceiros conveniados (isParceiro = false) - 10% DESCONTO -->
              <div 
                *ngIf="showAffiliatedDiscountMessage()"
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
              <td [ngClass]="shouldApplyFreeDiscount() ? 'text-green-600' : 'text-600'">
                {{ getDiscountText() }}
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
  hasPartner = signal<boolean>(false);
  isNonAffiliatedPartner = signal<boolean>(false); // Parceiro NÃO conveniado (isParceiro = true) - HORAS GRATUITAS
  isAffiliatedPartner = signal<boolean>(false); // Parceiro conveniado (isParceiro = false) - 10% DESCONTO
  hasFreeCourses = signal<boolean>(false);
  isRegularUser = signal<boolean>(true);

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
            
            // CORREÇÃO: Usando apenas a propriedade 'parceiro' que existe no modelo
            // REGRA 1: Usuário regular (sem parceiro) - SEM DESCONTO
            if (!res.parceiro) {
              this.isRegularUser.set(true);
              this.hasPartner.set(false);
              this.isNonAffiliatedPartner.set(false);
              this.isAffiliatedPartner.set(false);
              this.partnerName.set('');
            }
            // REGRA 2: Usuário com parceiro
            else if (res.parceiro) {
              this.hasPartner.set(true);
              this.isRegularUser.set(false);
              this.partnerName.set(res.parceiro.nome || '');
              
              // CORREÇÃO: Lógica baseada apenas no isParceiro
              if (res.parceiro.isParceiro === true) {
                // REGRA 2A: Parceiro NÃO conveniado (isParceiro = true) - HORAS GRATUITAS
                this.isNonAffiliatedPartner.set(true);
                this.isAffiliatedPartner.set(false);
              } else if (res.parceiro.isParceiro === false) {
                // REGRA 2B: Parceiro conveniado (isParceiro = false) - 10% DESCONTO
                this.isNonAffiliatedPartner.set(false);
                this.isAffiliatedPartner.set(true);
              }
            }
          });
        }

        // REGRA DE GRATUIDADE: 
        // Só aplica 100% desconto se for parceiro NÃO conveniado E horas disponíveis >= horas totais
        this.hasFreeCourses.update(() => {
          return this.isNonAffiliatedPartner() && // Deve ser parceiro NÃO conveniado
                 this.totalHours() <= this.availableHours(); // Horas totais <= horas disponíveis
        });
  
        // Definir percentual de desconto baseado nas regras
        this.discountPercent.update(() => {
          if (this.hasFreeCourses()) {
            return 1; // 100% de desconto (gratuidade) - APENAS para NÃO conveniados com horas suficientes
          } else if (this.isAffiliatedPartner()) {
            return 0.1; // 10% de desconto para conveniados
          } else {
            // Usuários regulares: SEM DESCONTO
            return 0;
          }
        });
  
        if (checkoutTotalPayment) {
          this.totalFinalValue.update(() => checkoutTotalPayment);
        }
      }
    );
  }

  // Exibir mensagem apenas para parceiros NÃO conveniados (HORAS GRATUITAS)
  showPartnerFreeHoursMessage(): boolean {
    return this.isNonAffiliatedPartner() && this.partnerName() !== '';
  }

  // Exibir mensagem para parceiros conveniados (10% DESCONTO)
  showAffiliatedDiscountMessage(): boolean {
    return this.isAffiliatedPartner() && this.partnerName() !== '';
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

  shouldApplyFreeDiscount(): boolean {
    // Só aplica desconto gratuito se for parceiro NÃO conveniado com horas suficientes
    return this.hasFreeCourses();
  }

  getDiscountText(): string {
    if (this.shouldApplyFreeDiscount()) {
      return '-100%';
    } else if (this.isAffiliatedPartner()) {
      return '10%';
    } else {
      return '0%';
    }
  }

  calculateFinalValueItem(item: CartType): number {
    // REGRA 1: Gratuidade (100% desconto) apenas para parceiros NÃO conveniados com horas suficientes
    if (this.shouldApplyFreeDiscount()) {
      return 0;
    }
    
    // REGRA 2: 10% de desconto para parceiros conveniados
    if (this.isAffiliatedPartner()) {
      return item.preco - item.preco * 0.1;
    }
    
    // REGRA 3: Usuários regulares - preço integral (SEM DESCONTO)
    return item.preco;
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
      status: 1,
      tipoPagamentos: isFreeOrder ? [0] : [1, 2, 3],
      subtotal: this.cartSubTotalPrice(),
      descontos: isFreeOrder ? this.cartSubTotalPrice() : (this.isAffiliatedPartner() ? this.discountValue() : 0),
      isento: isFreeOrder ? 1 : 0,
      taxaMatricula: isFreeOrder ? 0 : 50
    };

    console.log('=== DETALHES DO PEDIDO ===');
    console.log('Tipo de usuário:', this.getUserType());
    console.log('É parceiro NÃO conveniado (horas gratuitas)?', this.isNonAffiliatedPartner());
    console.log('É parceiro conveniado (10% desconto)?', this.isAffiliatedPartner());
    console.log('Horas disponíveis:', this.availableHours());
    console.log('Horas totais do carrinho:', this.totalHours());
    console.log('Pode usar horas gratuitas?', this.hasFreeCourses());
    console.log('É compra gratuita?', isFreeOrder);
    console.log('Desconto aplicado:', this.getDiscountText());
    console.log('Pedido a ser enviado:', mock);

    this.store.dispatch(OrderActions.selectOrder({ order: mock }));
  }

  // Método auxiliar para debugging
  private getUserType(): string {
    if (this.isRegularUser()) return 'USUÁRIO REGULAR (sem parceiro) - SEM DESCONTO';
    if (this.isNonAffiliatedPartner()) return 'PARCEIRO NÃO CONVENIADO (horas gratuitas)';
    if (this.isAffiliatedPartner()) return 'PARCEIRO CONVENIADO (10% desconto)';
    return 'TIPO NÃO IDENTIFICADO';
  }
}