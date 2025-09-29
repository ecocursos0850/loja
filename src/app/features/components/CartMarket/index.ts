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
              <!-- Mensagem sobre direito de uso - APENAS para cursos Direito Online -->
              <div 
                *ngIf="hasAnyDireitoOnlineCourse()"
                class="w-full flex py-4 px-4 bg-red-100 border border-red-300 rounded-lg items-center"
              >
                <i class="pi pi-exclamation-triangle text-red-500 mr-3 text-lg"></i>
                <p class="text-center font-medium text-red-800 text-sm m-0">
                  <strong>Importante:</strong> Cursos da categoria Direito Online, você adquiri o direito de uso do curso por 6 meses a partir da data da compra.
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
                  <span class="text-red-600 font-bold">
                    (Aplicável apenas para cursos da categoria Direito Online)
                  </span>
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
                  <span class="text-red-600 font-bold">
                    (Aplicável apenas para cursos da categoria Direito Online)
                  </span>
                </p>              
              </div>

              <!-- Mensagem informativa sobre horas disponíveis -->
              <div 
                *ngIf="showHoursInfoMessage()"
                class="w-full flex py-4 px-4 bg-green-100 border border-green-300 rounded-lg items-center"
              >
                <i class="pi pi-info-circle text-green-600 mr-3 text-lg"></i>
                <p class="text-center font-medium text-green-800 text-sm m-0">
                  <strong>Horas disponíveis:</strong> {{ availableHours() }}h | 
                  <strong>Horas Direito Online:</strong> {{ direitoOnlineTotalHours() }}h |
                  <strong>Status:</strong> 
                  <span [ngClass]="hasEnoughHoursForDireitoOnline() ? 'text-green-600' : 'text-red-600'">
                    {{ hasEnoughHoursForDireitoOnline() ? 'SUFICIENTES' : 'INSUFICIENTES' }}
                  </span>
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
                    <span *ngIf="!isDireitoOnlineCourse(item)" class="text-red-600 font-bold">
                      (Descontos de parceiro não aplicáveis)
                    </span>
                    <span *ngIf="isDireitoOnlineCourse(item) && shouldApplyFreeDiscount(item)" class="text-green-600 font-bold">
                      (GRATUITO - Horas disponíveis cobrem este curso)
                    </span>
                    <span *ngIf="isDireitoOnlineCourse(item) && !shouldApplyFreeDiscount(item) && isNonAffiliatedPartner()" class="text-red-600 font-bold">
                      (SERÁ COBRADO - Horas insuficientes)
                    </span>
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
                <small *ngIf="hasAnyDireitoOnlineCourse()" class="text-green-700">
                  ({{ direitoOnlineTotalHours() }}h em cursos Direito Online)
                </small>
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
  isNonAffiliatedPartner = signal<boolean>(false);
  isAffiliatedPartner = signal<boolean>(false);
  hasFreeCourses = signal<boolean>(false);
  isRegularUser = signal<boolean>(true);
  direitoOnlineTotalHours = signal<number>(0);

  // Novo método para verificar se um curso é da categoria Direito Online
  isDireitoOnlineCourse(item: CartType): boolean {
    return item.categoria?.titulo?.toLowerCase().includes('direito online');
  }

  // Verificar se há pelo menos um curso Direito Online no carrinho
  hasAnyDireitoOnlineCourse(): boolean {
    return this.items?.some(item => this.isDireitoOnlineCourse(item)) ?? false;
  }

  // Calcular horas totais apenas dos cursos Direito Online
  calculateDireitoOnlineTotalHours(): number {
    return this.items
      ?.filter(item => this.isDireitoOnlineCourse(item))
      ?.reduce((total, item) => total + (item.cargaHoraria || 0), 0) ?? 0;
  }

  // Verificar se as horas disponíveis cobrem os cursos Direito Online
  hasEnoughHoursForDireitoOnline(): boolean {
    return this.availableHours() >= this.direitoOnlineTotalHours();
  }

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
        
        // CALCULAR HORAS APENAS DOS CURSOS DIREITO ONLINE
        this.direitoOnlineTotalHours.set(this.calculateDireitoOnlineTotalHours());
  
        if (userDetails) {
          userDetails.forEach(res => {
            this.userId = res.id;
            this.availableHours.set(res.horasDisponiveis);
            
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

        // REGRA DE GRATUIDADE CORRIGIDA: 
        // Só aplica 100% desconto se for parceiro NÃO conveniado 
        // E horas disponíveis >= horas DOS CURSOS DIREITO ONLINE
        // E APENAS para cursos da categoria Direito Online
        this.hasFreeCourses.update(() => {
          return this.isNonAffiliatedPartner() && // Deve ser parceiro NÃO conveniado
                 this.hasEnoughHoursForDireitoOnline() && // Horas Direito Online <= horas disponíveis
                 this.hasAnyDireitoOnlineCourse(); // Deve ter pelo menos um curso Direito Online
        });
  
        // Definir percentual de desconto baseado nas regras
        // IMPORTANTE: O desconto só se aplica aos cursos Direito Online
        this.discountPercent.update(() => {
          if (this.hasFreeCourses()) {
            return 1; // 100% de desconto (gratuidade) - APENAS para Direito Online
          } else if (this.isAffiliatedPartner() && this.hasAnyDireitoOnlineCourse()) {
            return 0.1; // 10% de desconto para conveniados - APENAS para Direito Online
          } else {
            // Usuários regulares ou sem cursos Direito Online: SEM DESCONTO
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

  // Exibir mensagem informativa sobre horas
  showHoursInfoMessage(): boolean {
    return this.hasAnyDireitoOnlineCourse() && this.hasPartner();
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
    // Só aplica desconto gratuito se:
    // 1. For parceiro NÃO conveniado
    // 2. Tiver horas suficientes para os cursos Direito Online
    // 3. O curso específico for da categoria Direito Online
    return this.isNonAffiliatedPartner() && 
           this.hasEnoughHoursForDireitoOnline() && 
           this.isDireitoOnlineCourse(item);
  }

  getDiscountText(item: CartType): string {
    // Só aplica desconto se o curso for da categoria Direito Online
    if (!this.isDireitoOnlineCourse(item)) {
      return '0%';
    }

    if (this.shouldApplyFreeDiscount(item)) {
      return '-100%';
    } else if (this.isAffiliatedPartner()) {
      return '10%';
    } else {
      return '0%';
    }
  }

  calculateFinalValueItem(item: CartType): number {
    // Cursos de outras categorias SEMPRE são cobrados integralmente
    if (!this.isDireitoOnlineCourse(item)) {
      return item.preco;
    }

    // REGRA 1: Gratuidade (100% desconto) apenas para parceiros NÃO conveniados com horas suficientes
    if (this.shouldApplyFreeDiscount(item)) {
      return 0;
    }
    
    // REGRA 2: 10% de desconto para parceiros conveniados
    if (this.isAffiliatedPartner()) {
      return item.preco - item.preco * 0.1;
    }
    
    // REGRA 3: Usuários regulares ou parceiros NÃO conveniados sem horas suficientes - preço integral
    return item.preco;
  }

  closeOrder(): void {
    // Calcular valor total dos cursos que serão cobrados
    const cursosCobrados = this.items
      .filter(item => !this.shouldApplyFreeDiscount(item))
      .reduce((total, item) => total + this.calculateFinalValueItem(item), 0);

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
      descontos: isFreeOrder ? this.cartSubTotalPrice() : (this.isAffiliatedPartner() && this.hasAnyDireitoOnlineCourse() ? this.discountValue() : 0),
      isento: isFreeOrder ? 1 : 0,
      taxaMatricula: isFreeOrder ? 0 : 50
    };

    console.log('=== DETALHES DO PEDIDO ===');
    console.log('Tipo de usuário:', this.getUserType());
    console.log('É parceiro NÃO conveniado?', this.isNonAffiliatedPartner());
    console.log('É parceiro conveniado?', this.isAffiliatedPartner());
    console.log('Horas disponíveis:', this.availableHours());
    console.log('Horas totais do carrinho:', this.totalHours());
    console.log('Horas Direito Online:', this.direitoOnlineTotalHours());
    console.log('Tem cursos Direito Online?', this.hasAnyDireitoOnlineCourse());
    console.log('Horas suficientes para Direito Online?', this.hasEnoughHoursForDireitoOnline());
    console.log('Cursos gratuitos (Direito Online):', this.items.filter(item => this.shouldApplyFreeDiscount(item)).length);
    console.log('Cursos a serem cobrados:', this.items.filter(item => !this.shouldApplyFreeDiscount(item)).length);
    console.log('Valor total a cobrar:', cursosCobrados);
    console.log('Pedido a ser enviado:', mock);

    this.store.dispatch(OrderActions.selectOrder({ order: mock }));
  }

  private getUserType(): string {
    if (this.isRegularUser()) return 'USUÁRIO REGULAR (sem parceiro) - SEM DESCONTO';
    if (this.isNonAffiliatedPartner()) return 'PARCEIRO NÃO CONVENIADO (horas gratuitas)';
    if (this.isAffiliatedPartner()) return 'PARCEIRO CONVENIADO (10% desconto)';
    return 'TIPO NÃO IDENTIFICADO';
  }
}