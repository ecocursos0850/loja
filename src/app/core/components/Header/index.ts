import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CourseType } from '@shared/models/interface/course.interface';
import { coursesSelector } from '@shared/store/reducers/courses.reducer';
import { CoursesActions } from '@shared/store/actions/courses.actions';
import { LoadingAction } from '@shared/store/actions/loading.actions';
import { cartTotalItemsSelector } from '@shared/store/reducers/cart.reducer';
import { CartItemsComponent } from '@shared/components/ItemsList';
import { UserDetailsModel } from '@shared/models/classes/user-details.model';
import { CartActions } from '@shared/store/actions/cart.actions';
import { UserDetailsActions } from '@shared/store/actions/user-details.actions';
import { loginSelectUser } from '@shared/store/reducers/auth.reducer';
import { ScrollToTopDirective } from '@shared/directives/scroll-to-top.directive';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { DividerModule } from 'primeng/divider';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Store } from '@ngrx/store';

import { StudentPortalButtonComponent } from '../../../shared/components/StudentPortalButton/index';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="flex justify-content-center surface-ground py-2">
      <div class="flex grid w-90rem w-full align-items-center">
        <div
          class="flex col-12 lg:col-3 md:col-4 sm:col-12 justify-content-center md:justify-content-start p-0"
        >
         <a href="http://ecocursos.com.br">
        <img
          src="assets/images/Logo1.png"
          alt="Logo"
          style="width: 18.75rem"
          />
        </a>
        </div>

        <div class="col-10 sm:col-10 md:col-7 lg:col-6 ">
          <div
            class="w-full flex align-items-center justify-content-center relative"
          >
            <i class="absolute z-5 pi pi-search" style="left: 1.3rem"></i>

            <p-autoComplete
              #searchInput
              [(ngModel)]="value"
              (onSelect)="getSearchValue()"
              styleClass="w-full"
              inputStyleClass="w-full px-6"
              class="w-full border-round-2xl"
              [forceSelection]="true"
              [suggestions]="filteredCourse"
              (completeMethod)="filterCourse($event)"
              field="titulo"
              placeholder="Procure já seu futuro!"
              [lazy]="true"
              [completeOnFocus]="true"
            >
              <ng-template let-course pTemplate="item">
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-search" style="left: 1.3rem"></i>
                  <div>{{ course.titulo }}</div>
                </div>
              </ng-template>
            </p-autoComplete>
            <p-button
              class="absolute z-5 right-0"
              (onClick)="clearField()"
              icon="pi pi-times"
              [rounded]="true"
              [text]="true"
              severity="danger"
            />
          </div>
        </div>

        <div
          class="col-2 sm:col-2 md:col-1 flex justify-content-end md:justify-content-center lg:col-1"
        >
          <p-button
            [pTooltip]="totalCartItems() > '0' ? hasCart : noCart"
            [routerLink]="'carrinho-de-compras'"
            [autoHide]="false"
            tooltipPosition="bottom"
            [showDelay]="800"
            [hideDelay]="900"
            styleClass="p-button-info text-gray-600"
          >
            <i
              class="pi pi-cart-plus text-lg"
              severity="danger"
              pBadge
              [value]="totalCartItems()"
            ></i>
          </p-button>
        </div>

        <app-student-portal-button
          class="hidden col-12 md:col-0 lg:inline-flex lg:col-2 justify-content-end"
        />
      </div>

      <ng-template #noCart>
        <div
          class="flex py-2 text-2xl flex-column align-items-center gap-1 bg-white"
        >
          <div class="flex gap-1 flex-column align-items-center">
            <i class="text-3xl pi pi-shopping-cart"></i>
            <span>Seu carrinho está vazio</span>
          </div>
          <p-button
            class="mt-5"
            [routerLink]="'/categorias'"
            styleClass="p-button-link"
            [link]="true"
            size="small"
            label="Ir para a página cursos"
          />
        </div>
      </ng-template>

      <ng-template #hasCart> <app-items-list /> </ng-template>
    </header>
  `,
  imports: [
    CommonModule,
    InputTextModule,
    ScrollToTopDirective,
    FormsModule,
    ButtonModule,
    BadgeModule,
    RouterLink,
    RouterModule,
    TooltipModule,
    RippleModule,
    DividerModule,
    AutoCompleteModule,
    CartItemsComponent,
    StudentPortalButtonComponent
  ]
})
export class HeaderComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private ref = inject(ElementRef);

  value: CourseType;
  getScreenHeight: number;
  getScreenWidth: number;

  courses: CourseType[];
  userInfor = signal<UserDetailsModel>(new UserDetailsModel());

  filteredCourse: any[];

  totalCartItems = signal<string>('0');

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    this.getSize();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.onWindowResize();
    }, 1);

    this.userDetails();
    this.store.dispatch(CartActions.enter());
    this.store.dispatch(CoursesActions.enter());
    this.store.select(coursesSelector).subscribe({
      next: res => {
        this.courses = res.collection;
      }
    });

    this.store.select(cartTotalItemsSelector).subscribe({
      next: res => {
        this.totalCartItems.update(() => res.toString());
      }
    });
  }

  clearField(): void {
    const input = this.ref.nativeElement.querySelector('.p-autocomplete-input');

    if (input.value) {
      this.store.dispatch(CoursesActions.enter());
      this.store.dispatch(LoadingAction.loading({ message: true }));
      this.removeQueryParams();
    }
    input.value = '';
  }

  removeQueryParams(): void {
    this.router.navigate([], {
      queryParams: {
        id: null,
        title: null
      },
      queryParamsHandling: 'merge'
    });
  }

  getSearchValue(): void {
    const searchValue = this.value?.titulo;
    this.store.dispatch(CoursesActions.searchCourse({ search: searchValue }));
    this.store.dispatch(LoadingAction.loading({ message: true }));

    const queryParams = {
      id: this.value.id,
      title: this.value.titulo
    };

    this.router.navigate(['categorias'], { queryParams });
  }

  getSize(): void {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;

    const portButton = document.querySelector('#class_button');
    const menu = document.getElementsByClassName('p-menubar-root-list');
    const buttonBox = document.querySelector('#button_box');

    if (portButton && menu) {
      if (this.getScreenWidth < 960) {
        menu[0]?.appendChild(portButton);
      } else {
        buttonBox?.appendChild(portButton);
        menu[0]?.setAttribute(`class`, 'p-menubar-root-list');
      }
    }
  }

  userDetails(): void {
    this.store.select(loginSelectUser).subscribe({
      next: user => {
        if (user) {
          this.store.dispatch(UserDetailsActions.user({ email: user.email }));
        }
      }
    });
  }

  filterCourse(event: any): void {
    const query = event.query.toLowerCase();

    this.filteredCourse = this.courses.filter(course => {
      const titleLowerCase = course.titulo.toLowerCase();
      const subsTitleLowerCase = titleLowerCase.substring(
        0,
        course.titulo.length
      );
      return subsTitleLowerCase.includes(query);
    });
  }
}
