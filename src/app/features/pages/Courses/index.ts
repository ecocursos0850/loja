import { Component, inject, OnInit, signal } from '@angular/core';
import { AppMenuitemComponent } from '@shared/components/MenuItem';
import { CommonModule, CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { AppMenuComponent } from '@shared/components/Menu';
import { LayoutComponent } from '@shared/components/Layout';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatorComponent } from '@shared/components/Paginator';
import {
  courseSelectorCollectionLength,
  courseSelectorPaginatorCollectionLength,
  coursesPaginatorAllItemsSelector,
  coursesPaginatorSearchItemsSelector,
  coursesPaginatorWithFilterSelector
} from '@shared/store/reducers/courses.reducer';
import { LoadingAction } from '@shared/store/actions/loading.actions';
import { CoursesActions } from '@shared/store/actions/courses.actions';
import {
  CourseType,
  MaterialType
} from '@shared/models/interface/course.interface';
import { CartType } from '@shared/models/classes/cart-market.model';
import { CartActions } from '@shared/store/actions/cart.actions';
import { cartItemsSelector } from '@shared/store/reducers/cart.reducer';
import { CourseTypeEnum } from '@shared/models/enum/course-type.enum';
import { GetDirectoryImage } from '@shared/pipes/convert-base64.pipe';
import { MaterialTypeEnum } from '@shared/models/enum/material-type.enum';
import { userDetailsSelect } from '@shared/store/reducers/user-details.reducer';
import { PaginatorModel } from '@shared/models/classes/paginator.model';
import { Constants } from '@shared/utils/constants';

import { combineLatest, of, switchMap, tap } from 'rxjs';

import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DividerModule } from 'primeng/divider';
import { TreeModule } from 'primeng/tree';
import { SlideMenuModule } from 'primeng/slidemenu';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AnimateModule } from 'primeng/animate';
import { InputTextModule } from 'primeng/inputtext';
import { Store } from '@ngrx/store';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';

import { SidebarComponent } from '../../../core/components/Sidebar';
import { NoImageComponent } from '../../../shared/components/NoImage/index';
import { NoDataComponent } from '../../../shared/components/NoData/index';

@Component({
  selector: 'page-courses',
  standalone: true,
  imports: [
    PanelMenuModule,
    DataViewModule,
    DividerModule,
    TreeModule,
    SlideMenuModule,
    AppMenuitemComponent,
    NgForOf,
    NgIf,
    SidebarComponent,
    AppMenuComponent,
    CommonModule,
    LayoutComponent,
    ButtonModule,
    RippleModule,
    AnimateModule,
    InputTextModule,
    PaginatorComponent,
    CurrencyPipe,
    TagModule,
    NoImageComponent,
    NoDataComponent,
    GetDirectoryImage
  ],
  template: `
    <div class="flex flex-column">
      <div
        class="grid gap-4 w-full m-0 justify-content-center md:justify-content-center"
        *ngIf="courses()?.length; else noData"
      >
        <section
          class="shadow-1 bg-white border-round-xl card-style w-22rem md:w-20rem
          transition-linear transition-duration-300 hover:shadow-3"
          *ngFor="let course of courses()"
        >
          <div
            [pTooltip]="tooltipContent"
            tooltipZIndex="z-1"
            [autoHide]="false"
            [fitContent]="false"
            [showDelay]="1000"
            class="min-h-4rem border-round-xl"
          >
            <!-- *ngIf="
              !isPartner && !(course.categoria.titulo === 'DIREITO ONLINE')
            " -->
            <ng-template #tooltipContent>
              <div class="flex flex-column bg-white">
                <p class="mt-2 mb-0 text-red-600 text-lg font-bold">
                  {{ course.titulo | uppercase }}
                </p>
                <small>em {{ course.categoria?.titulo }}</small>
                <p-divider class="w-full" />
                <div class="flex flex-row w-full justify-content-between">
                  <small class="flex align-items-center gap-1">
                    <i class="text-red-600 pi pi-clock"></i>
                    {{ course.cargaHoraria }} Horas
                  </small>
                  <small
                    *ngIf="quantityOfVideos(course.materiais)"
                    class="flex align-items-center gap-1"
                  >
                    <i class="text-red-600 pi pi-video"></i>
                    {{ quantityOfVideos(course.materiais) }}
                    {{
                      quantityOfVideos(course.materiais) > 1
                        ? 'Videos'
                        : 'Video'
                    }}
                  </small>
                  <small
                    *ngIf="quantityOfPdf(course.materiais)"
                    class="flex align-items-center gap-1"
                  >
                    <i class="text-red-600 pi pi-book"></i>
                    {{ quantityOfPdf(course.materiais) }}
                    {{
                      quantityOfPdf(course.materiais) > 1
                        ? 'Materiais'
                        : 'Material'
                    }}
                  </small>
                </div>

                <p-divider type="solid" class="w-full mt-1" />
                <small>{{ course.descricao | uppercase }}</small>
              </div>
            </ng-template>
            <div class="flex flex-column w-full relative">
              <p-tag
                *ngIf="course.promocao"
                class="absolute z-1 m-3 sm:m-2 left-0"
                icon="pi pi-exclamation-triangle"
                severity="warning"
                value="Promoção"
              />
              <p-tag
                class="absolute z-1 m-3 sm:m-2 right-0"
                icon="pi pi-clock"
                value="{{ course?.cargaHoraria }} Horas"
              />
              <header
                class="w-full h-14rem"
                [style]="{ display: 'block', overflow: 'hidden' }"
              >
                <img
                  *ngIf="course.capa; else noImage"
                  class="w-full h-full cursor-pointer border-round-xl border-noround-bottom image-hover image-content"
                  [src]="course.capa | directory_image"
                  [alt]="course.titulo"
                  (click)="navigateTo(course.titulo, course.id.toString())"
                />
              </header>

              <p-divider type="solid" class="w-full" styleClass="my-3" />

              <div class="px-5 pb-3">
                <main class="flex mb-4 flex-column">
                  <div class="min-h-27rem">
                    <a
                      (click)="navigateTo(course.titulo, course.id.toString())"
                      class="m-0 text-lg cursor-pointer font-bold text-800 line-height-3
                    text-ellipsis-2 transition-all transition-duration-500 hover:text-red-600
                    hover:underline hover:font-bold"
                    >
                      {{ course.titulo }}
                    </a>
                    <span class="text-sm text-600 mb-2">
                      {{ categoryType(course.tipoCurso) | uppercase }}
                    </span>
                    <span class="text-sm mt-2 text-600 mb-2 text-ellipsis-3">
                      {{ course.descricao }}
                    </span>
                  </div>

                  <p-divider class="w-full" styleClass="my-3" />

                  <div
                    class="flex flex-column"
                    *ngIf="course.categoria?.titulo !== 'GRADUAÇÃO' && course.categoria?.titulo !== '2ª GRADUAÇÃO'"
                  >
                                   <span
                  [ngClass]="hasParcels(course.qtdParcelas) ? 'text-base' : 'text-2xl'"
                  class="text-red-600 font-bold text-right mb-2"
                >
                  {{ course.preco === 0 ? 'Gratuito' : (course.preco | currency) }}
                </span>
                    <span *ngIf="hasParcels(course.qtdParcelas)" class="text-right">
                      Até
                      <strong>
                        {{ course.qtdParcelas }} x {{
                          parcelsValue(course.qtdParcelas, course.preco) | currency
                        }}
                      </strong>
                    </span>
                    <span *ngIf="course.preco === 0" class="text-right">Nenhuma parcela</span>
                  </div>
                </main>
                <footer class="w-full flex justify-content-center">
                  <p-button
                    [label]="
                    course.categoria?.titulo !== 'GRADUAÇÃO' && course.categoria?.titulo !== '2ª GRADUAÇÃO'
                        ? 'Adicionar ao carrinho'
                        : 'Falar com vendedor'
                    "
                    styleClass="p-2"
                    [icon]="
                    course.categoria?.titulo !== 'GRADUAÇÃO' && course.categoria?.titulo !== '2ª GRADUAÇÃO'
                        ? 'pi pi-cart-plus'
                        : 'pi pi-send'
                    "
                    [disabled]="disabledButton(course.id)"
                    (onClick)="
                    course.categoria?.titulo !== 'GRADUAÇÃO' && course.categoria?.titulo !== '2ª GRADUAÇÃO'
                        ? addToCart(course)
                        : goToSalesRep()
                    "
                  />
                </footer>
              </div>
            </div>
          </div>
        </section>
      </div>
      <app-paginator
        class="w-full mt-6"
        [totalRecords]="totalCourses"
        (pageChange)="onPageChange($event)"
      />
    </div>

    <ng-template #noData>
      <app-no-data />
    </ng-template>

    <ng-template #noImage>
      <app-no-image />
    </ng-template>
  `,
  styles: [
    `
      .image-content {
        display: block;
        height: 100%;
        object-fit: cover;
        object-position: top;
      }

      .card-style {
        &:hover {
          .image-hover {
            transform: scale3d(1.1, 1.1, 1);
            transition: transform 1s ease-in-out;
          }
        }
      }
    `
  ]
})
export class CoursesPageComponent implements OnInit {
  getItemsFromCartById = signal<number[]>([]);
  layout: string = 'list';

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);

  routeName: string;
  categoryRouteId: string | number;
  paramsType: string | null;
  idType: string | null;
  items: MenuItem[];

  courses = signal<CourseType[]>([]);
  totalCourses: number;

  indexPage: number = 0;

  ngOnInit(): void {
    this.routeName = this.router.url.toString();
    this.store.dispatch(CoursesActions.enter());
    this.checkActivedRoute();
    this.getCoursesItems();
    this.checkItemsStore();

    this.store.dispatch(LoadingAction.loading({ message: true }));
  }

  getCoursesItems(): void {
    combineLatest([
      this.store.select(coursesPaginatorAllItemsSelector),
      this.store.select(courseSelectorCollectionLength),
      this.store.select(coursesPaginatorWithFilterSelector),
      this.store.select(courseSelectorPaginatorCollectionLength),
      this.store.select(coursesPaginatorSearchItemsSelector)
    ])
      .pipe(
        switchMap(
          ([
            result,
            collectionLength,
            CollectionPaginator,
            paginatorLength,
            collectionBySearch
          ]) => {
            const hasFilter =
              paginatorLength > 0 ||
              (collectionBySearch && collectionBySearch.length > 0);
            if (hasFilter) {
              if (collectionBySearch && collectionBySearch.length) {
                return of({
                  courses: collectionBySearch,
                  totalCourses: paginatorLength
                });
              }
              return of({
                courses: CollectionPaginator,
                totalCourses: paginatorLength
              });
            } else if (this.paramsType && !hasFilter) {
              return of({
                courses: [],
                totalCourses: 0
              });
            } else {
              return of({
                courses: result,
                totalCourses: collectionLength
              });
            }
          }
        ),
        tap(({ courses, totalCourses }) => {
          this.courses.update(() => courses);
          this.totalCourses = totalCourses;
        })
      )
      .subscribe();
  }

  disabledButton(id: number): boolean {
    return this.getItemsFromCartById().some(item => item === id);
  }

  parcelsValue(parcels: string, value: number): number {
    return value / Number(parcels);
  }

  hasParcels(parcels: string): boolean {
    return Number(parcels) > 0;
  }

  onPageChange(event: PaginatorModel): void {
    this.indexPage = event.page;

    this.store.dispatch(CoursesActions.selectPageByPaginator({ page: event }));
  }

  checkItemsStore(): void {
    this.store.select(cartItemsSelector).subscribe({
      next: result => {
        const buttonDisabled = result.map(item => item.id);
        this.getItemsFromCartById.set(buttonDisabled);
      }
    });
  }

  checkActivedRoute = (): void => {
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.store.dispatch(CoursesActions.enter());

      this.paramsType = params.get('type');
      this.idType = params.get('id');

      this.store.dispatch(LoadingAction.loading({ message: true }));

      if (this.paramsType === 'categoria' && this.idType) {
        this.store.dispatch(
          CoursesActions.selectCourseByCategory({ id: this.idType })
        );
      } else if (this.paramsType === 'subcategoria' && this.idType) {
        this.store.dispatch(
          CoursesActions.selectCourseBySubCategory({ id: this.idType })
        );
      }
    });
  };

  quantityOfPdf(materials: MaterialType[]): number {
    let pdfQuantity = 0;
    for (const material of materials)
      if (this.pdfOrVideo(material.tipoMaterial) === 'PDF') pdfQuantity += 1;
    return pdfQuantity;
  }

  quantityOfVideos(materials: MaterialType[]): number {
    let videoQuantity = 0;
    for (const material of materials)
      if (this.pdfOrVideo(material.tipoMaterial) === 'Video')
        videoQuantity += 1;
    return videoQuantity;
  }

  categoryType(type: number): string {
    return CourseTypeEnum[type];
  }

  addToCart(item: CourseType): void {
    const cart = new CartType(item);
    this.store.dispatch(CartActions.addItemToCart({ item: cart }));
  }

  navigateTo(title: string, code: string): void {
    this.router.navigate(['cursos', title, code]);
  }

  goToSalesRep(): void {
    window.open(Constants.SalesRepLink);
  }

  private pdfOrVideo(type: number): string {
    return MaterialTypeEnum[type];
  }

  get isPartner(): boolean {
    let hasPartner = false;
    this.store.select(userDetailsSelect).subscribe({
      next: user =>
        user.map(details => {
          hasPartner = details.parceiro ? true : false;
        })
    });

    return hasPartner;
  }
}
