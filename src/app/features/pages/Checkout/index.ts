import {
  Component,
  Injector,
  OnInit,
  WritableSignal,
  effect,
  inject,
  signal
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { 
  cartItemsSelector,
  cartTotalHoursSelector 
} from '@shared/store/reducers/cart.reducer';
import {
  userDetailsAvailableHoursSelect,
  userDetailsPartner
} from '@shared/store/reducers/user-details.reducer';

import { combineLatest } from 'rxjs';

import { AccordionModule } from 'primeng/accordion';
import { Store } from '@ngrx/store';
import { Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';

import { QuoteSummaryComponent } from '../../components/QuoteSummary';
import { CreditCardComponent } from '../../components/Payments/CreditCard';
import { TicketComponent } from '../../components/Payments/Ticket';
import { CardNavigationComponent } from '../../../core/components/CardNavigation';
import { CartType } from '@shared/models/classes/cart-market.model';

@Component({
  selector: 'page-checkout',
  standalone: true,
  template: `
    <app-card-navigation />
    <div style="min-height: 80vh" class="w-90rem m-auto px-0 mt-4 md:px-4">
      <p-messages
        *ngIf="hasDireitoOnlineCourses()"
        [(value)]="messages"
        [closable]="true"
        styleClass="flex w-full justify-content-between"
      />
      <div
        class="md:flex-row flex-column-reverse grid m-0 flex
        flex-column flex-column-reverse justify-content-between"
      >
        <div class="md:col-8 col-12">
          <router-outlet></router-outlet>
        </div>
        <div class="md:col-4 col-12 flex flex-1 justify-content-end h-full">
          <app-quote-summary class="w-full" />
        </div>
      </div>
    </div>
  `,
  imports: [
    RouterOutlet,
    QuoteSummaryComponent,
    AccordionModule,
    CreditCardComponent,
    TicketComponent,
    CardNavigationComponent,
    MessagesModule
  ]
})
export class CheckoutPageComponent implements OnInit {
  private store = inject(Store);
  private injector = inject(Injector);
  messages: Message[] = [];

  availableHours = signal<number>(0);
  totalHours: WritableSignal<number> = signal<number>(0);
  isUserPartner: WritableSignal<boolean> = signal<boolean>(false);
  cartItems = signal<CartType[]>([]);

  ngOnInit(): void {
    this.getStateDataValues();
    this.messageValidation();
  }

  getStateDataValues(): void {
    combineLatest([
      this.store.select(cartTotalHoursSelector),
      this.store.select(cartItemsSelector),
      this.store.select(userDetailsAvailableHoursSelect),
      this.store.select(userDetailsPartner)
    ]).subscribe(([cartTotalHours, cartItems, userAvailableHours, userDetailsPartner]) => {
      this.totalHours.update(() => cartTotalHours);
      this.cartItems.set(cartItems);
      this.availableHours.update(() => userAvailableHours ?? 0);
      if (userDetailsPartner)
        this.isUserPartner.update(() => userDetailsPartner);
    });
  }

  // Método para verificar se um curso é da categoria Direito Online
  private isDireitoOnlineCourse(item: CartType): boolean {
    return item.categoria?.titulo?.toLowerCase().includes('direito online');
  }

  // Verificar se há cursos Direito Online no carrinho
  hasDireitoOnlineCourses(): boolean {
    return this.cartItems()?.some(item => this.isDireitoOnlineCourse(item)) ?? false;
  }

  // Calcular horas totais apenas dos cursos Direito Online
  private getDireitoOnlineTotalHours(): number {
    return this.cartItems()
      ?.filter(item => this.isDireitoOnlineCourse(item))
      ?.reduce((total, item) => total + (item.cargaHoraria || 0), 0) ?? 0;
  }

  messageValidation(): void {
    effect(
      () => {
        const hasDireitoOnline = this.hasDireitoOnlineCourses();
        const direitoOnlineHours = this.getDireitoOnlineTotalHours();
        
        // A mensagem só é exibida se:
        // 1. O usuário é parceiro
        // 2. Há cursos Direito Online no carrinho  
        // 3. As horas totais de Direito Online ultrapassam as horas disponíveis
        if (this.isUserPartner() && hasDireitoOnline && direitoOnlineHours > this.availableHours()) {
          const horasExcedentes = direitoOnlineHours - this.availableHours();
          this.messages = [
            {
              severity: 'warn',
              summary: 'Atenção - Cursos Direito Online',
              detail: `Os cursos de Direito Online serão cobrados! Pois você ultrapassou ${horasExcedentes} horas, do total de ${this.availableHours()}h permitido gratuitamente por semestre para esta categoria.`
            }
          ];
        } else {
          this.messages = [];
        }
      },
      { injector: this.injector }
    );
  }
}