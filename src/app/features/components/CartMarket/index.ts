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
import { CourseType } from '@shared/models/interface/course.interface';

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
        <div class="w-full flex py-5">
          <small class="w-full text-center"
            >Você está comprando o direito de uso do curso por 6 meses a partir
            da data da compra.</small
          >
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
                </div>
              </td>

              <td class="'text-600'">{{ (item.preco | currency) ?? '-' }}</td>

              <td>{{ ('0' | percent) ?? '-' }}</td>
              <td [ngClass]="discountPercent() ? 'text-green-600' : 'text-600'">
              {{ discountPercent() ? '-' : (discountPercent() * 100 + '%') }}
              </td>
              <td class="font-bold">
                {{ calculateFinalValueItem(item.preco) | currency }}
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
  totalFinalValue = signal<number>(0);
  cartSubTotalPrice = signal<number>(0);
  mountOrder = signal(new OrderModel());
  totalFinalValueItem = signal<number>(0);
  totalHours: WritableSignal<number> = signal<number>(0);
  discountPercent: WritableSignal<number> = signal<number>(0);
  discountValue = computed(
    () => this.cartSubTotalPrice() * this.discountPercent()
  );

  isPartner = signal<boolean>(false);

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

        if (userDetails)
          userDetails.forEach(res => {
            this.userId = res.id;
            this.availableHours.set(res.horasDisponiveis);
            this.isPartner.update(() => {
              return res.parceiro && res.parceiro.isParceiro;
            });
          });

        this.discountPercent.update(() => {
          return this.isAllLawOnline(cartItems) &&
            !(this.totalHours() > this.availableHours())
            ? 1
            : Number(userDetailsDiscount) / 100;
        });

        if (checkoutTotalPayment)
          this.totalFinalValue.update(() => checkoutTotalPayment);
      }
    );
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

  calculateFinalValueItem(price: number): number {
    return price - price * (this.isPartner() ? this.discountPercent() : 0);
  }

  isAllLawOnline(courses: CartType[]): boolean {
    return courses.every(
      course => course.categoria.titulo === 'DIREITO ONLINE'
    );
  }

 closeOrder(): void {
  const mock: OrderModel = {
    aluno: {
      id: this.userId
    },
    cursos: this.items.map(res => {
      return { id: res.id };
    }),
    status: 1,
    tipoPagamentos:
      !this.isAllLawOnline(this.items) ||
      !this.isPartner() ||
      this.totalHours() > this.availableHours()
        ? [1, 2, 3]
        : [0],
    subtotal: this.cartSubTotalPrice(),
    descontos: this.isPartner() ? this.discountValue() : 0, // Ajuste aqui
    isento:
      this.isPartner() &&
      (this.totalHours() <= this.availableHours()) ? 1 : 0, // Ajuste aqui
    taxaMatricula: 50
  };

  console.log('***', mock);

  this.store.dispatch(OrderActions.selectOrder({ order: mock }));
}
}

