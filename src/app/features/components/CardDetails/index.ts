import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CurrencyPipe,
  NgIf,
  TitleCasePipe,
  UpperCasePipe
} from '@angular/common';
import { CourseType } from '@shared/models/interface/course.interface';
import { coursesItemSelector } from '@shared/store/reducers/courses.reducer';
import { CoursesActions } from '@shared/store/actions/courses.actions';
import { LoadingAction } from '@shared/store/actions/loading.actions';
import { NoDataComponent } from '@shared/components/NoData';
import { NoImageComponent } from '@shared/components/NoImage';
import { CartType } from '@shared/models/classes/cart-market.model';
import { CartActions } from '@shared/store/actions/cart.actions';
import { cartItemsSelector } from '@shared/store/reducers/cart.reducer';
import { GetDirectoryImage } from '@shared/pipes/convert-base64.pipe';
import { MaterialTypeEnum } from '@shared/models/enum/material-type.enum';
import { Constants } from '@shared/utils/constants';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { Store } from '@ngrx/store';
import { TagModule } from 'primeng/tag';

import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitize-html.pipe';

@Component({
  selector: 'app-page-card-details',
  standalone: true,
  template: `
    <ng-container *ngIf="course; then hasCourse; else noData"> </ng-container>

    <ng-template #hasCourse>
      <div
        class="bg-white shadow-1 p-2 border-round-xl md:p-3"
        style="min-height: 84vh"
      >
        <div
          class="w-full flex grid m-0 gap-4 md:gap-0 justify-content-between"
        >
          <div class="col-12 md:col-4">
            <div *ngIf="course.capa; else noImage">
              <img
                class="w-full h-full shadow-3 border-round-xl"
                [src]="course.capa | directory_image"
                [alt]="course.titulo"
              />
            </div>

            <div class="flex w-full flex-1 my-4 mx-0 grid">
              <div class="flex col-5 flex-column gap-1">
                <label class="font-bold text-500">{{
                  'Carga horária' | titlecase
                }}</label>
                <span class="line-height-0 flex align-items-center gap-1">
                  <i class="text-red-600 pi pi-clock"></i>
                  <small class="text-sm">
                    {{ course.cargaHoraria }} horas</small
                  >
                </span>
              </div>
              <div class="flex col-7 flex-column gap-1">
                <label class="font-bold text-500">{{
                  'Material didático' | titlecase
                }}</label>
                <span class="line-height-0 flex align-items-center gap-1">
                  <i class="text-red-600 pi pi-cloud"></i>
                  <small class="text-sm">
                    {{ pdfQuantity }}
                    {{ pdfQuantity > 1 ? 'Arquivos' : 'Arquivo' }}
                  </small>
                </span>
              </div>
              <div class="flex flex-column col-5 gap-1">
                <label class="font-bold text-500">{{
                  'video aulas' | titlecase
                }}</label>
                <span class="line-height-0 flex align-items-center gap-1">
                  <i class="text-red-600 pi pi-video"></i>
                  <small class="text-sm">
                    {{ videoQuantity }}
                    {{ pdfQuantity > 1 ? 'videos' : 'video' }}
                  </small>
                </span>
              </div>
              <div class="flex flex-column col-7 gap-1">
                <label class="font-bold text-500">{{
                  'Inclui' | titlecase
                }}</label>
                <span class="line-height-0 flex align-items-center gap-1">
                  <i class="text-red-600 pi pi-book"></i>
                  <small class="text-sm"> Certificado de conclusão </small>
                </span>
              </div>
              <div class="flex flex-column col-12 gap-1">
                <label class="font-bold text-500">{{
                  'disponibilidade' | titlecase
                }}</label>
                <span class="line-height-4 flex align-items-center gap-1">
                </span>
              </div>
            </div>
          </div>
          <div class="flex flex-column col-12 m-0 md:col-7 px-2">
            <p-tag
              *ngIf="course.promocao"
              class="mt-2"
              styleClass="p-2 text-base"
              icon="pi pi-info-circle"
              severity="warning"
              value="Promoção"
            />
            <h1
              class="text-red-600 font-bold my-2 text-center md:text-left text-3xl"
            >
              {{ course.titulo | uppercase }}
            </h1>
            <p>
              em <strong>{{ course.categoria.titulo | uppercase }}</strong>
            </p>
            <p class="line-height-4">
              {{ course.descricao }}
            </p>
            <div class="mt-2 flex flex-column gap-2">
              <div class="flex gap-1 align-items-center">
                <i class="text-red-600 pi pi-info-circle"></i>
                <small class="font-bold text-base">Atenção</small>
              </div>
              <p class="line-height-4">
                Você tem prazo de 180 dias para realizar sua avaliação a partir
                da data de liberação. Após esse prazo seu curso expira devendo
                efetuar nova inscrição.
              </p>
            </div>

            <p-divider />

            <div
              class="flex mt-5 align-items-center justify-content-center md:justify-content-between grid m-0"
            >
              <h1
              *ngIf="course.categoria?.titulo !== 'GRADUAÇÃO' && course.categoria?.titulo !== '2ª GRADUAÇÃO'"
                class="font-bold text-700 text-center md:text-left m-0 text-5xl col-12 md:col-6"
              >
                {{ course.preco | currency }}
              </h1>

              <p-button
                [id]="course.id"
                class="mt-3 md:mt-0"
                styleClass="flex-5"
                [disabled]="disabledButton(course.id)"
                [label]="
                course.categoria?.titulo !== 'GRADUAÇÃO' && course.categoria?.titulo !== '2ª GRADUAÇÃO'
                    ? 'Adicionar ao carrinho'
                    : 'Falar com vendedor'
                "
                [icon]="
                course.categoria?.titulo !== 'GRADUAÇÃO' && course.categoria?.titulo !== '2ª GRADUAÇÃO'
                    ? 'pi pi-cart-plus'
                    : 'pi pi-send'
                "
                (onClick)="
                course.categoria?.titulo !== 'GRADUAÇÃO' && course.categoria?.titulo !== '2ª GRADUAÇÃO'
                    ? addToCart(course)
                    : goToSalesRep()
                "
              />
            </div>
          </div>
        </div>

        <p-divider />

        <div class="w-full px-2">
          <div
            *ngIf="course.conteudo"
            [innerHTML]="course.conteudo | sanitizeHtml"
          ></div>
        </div>
        <div class="w-full px-2">
          <div
            *ngIf="course.rodape"
            [innerHTML]="course.rodape | sanitizeHtml"
          ></div>
        </div>
        <div class="w-full px-2">
          <div
            *ngIf="course.rodapeAfiliado"
            [innerHTML]="course.rodapeAfiliado | sanitizeHtml"
          ></div>
        </div>
      </div>
    </ng-template>

    <ng-template #noData>
      <app-no-data />
    </ng-template>

    <ng-template #noImage>
      <app-no-image />
    </ng-template>
  `,
  imports: [
    UpperCasePipe,
    TitleCasePipe,
    ButtonModule,
    DividerModule,
    CurrencyPipe,
    TagModule,
    NgIf,
    NoDataComponent,
    NoImageComponent,
    GetDirectoryImage,
    SanitizeHtmlPipe
  ]
})
export class CardDetailsPageComponent implements OnInit {
  @ViewChild('contentCourse') contentCourse: ElementRef;
  @ViewChild('buttonAddToCart') buttonAddToCart: ElementRef;

  private route = inject(ActivatedRoute);
  private store = inject(Store);

  getItemsFromCartById = signal<number[]>([]);

  pdfQuantity = 0;
  videoQuantity = 0;
  course: CourseType;
  code: string;

  ngOnInit(): void {
    this.store.dispatch(LoadingAction.loading({ message: true }));

    const id = this.route.snapshot.paramMap.get('code');
    if (id) this.store.dispatch(CoursesActions.selectCourseById({ id: id }));
    this.store.select(coursesItemSelector).subscribe({
      next: course => {
        if (course) {
          this.course = course;
          this.pdfQuantity = 0;
          this.videoQuantity = 0;
          this.quantityOfVideos();
        }
      }
    });

    this.checkItemsStore();
  }

  disabledButton(id: number): boolean {
    return this.getItemsFromCartById().some(item => item === id);
  }

  checkItemsStore(): void {
    this.store.select(cartItemsSelector).subscribe({
      next: result => {
        const buttonDisabled = result.map(item => item.id);
        this.getItemsFromCartById.set(buttonDisabled);
      }
    });
  }

  quantityOfVideos(): void {
    for (const material of this.course.materiais) {
      switch (this.pdfOrVideo(material.tipoMaterial)) {
        case 'PDF':
          this.pdfQuantity += 1;
          break;
        case 'Video':
          this.videoQuantity += 1;
          break;
      }
    }
  }

  addToCart(item: CourseType): void {
    const cart = new CartType(item);
    this.store.dispatch(CartActions.addItemToCart({ item: cart }));
  }

  goToSalesRep(): void {
    window.open(Constants.SalesRepLink);
  }

  private pdfOrVideo(type: number): string {
    return MaterialTypeEnum[type];
  }
}
