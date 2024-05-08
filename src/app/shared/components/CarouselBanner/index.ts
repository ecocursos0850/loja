import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgForOf } from '@angular/common';

import { SwiperComponent, SwiperModule } from 'swiper/angular';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import SwiperCore, {
  EffectCards,
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller
} from 'swiper';
export interface Slide {
  headline?: string;
  src: string;
  index: number;
}

SwiperCore.use([
  EffectCards,
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller
]);

@Component({
  selector: 'app-carousel-banner',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    GalleriaModule,
    NgForOf,
    ButtonModule,
    CarouselModule,
    SwiperModule
  ],
  template: `
    <swiper
      #swiper
      class="w-full h-full"
      [loop]="true"
      [autoHeight]="true"
      [centeredSlides]="true"
      [allowTouchMove]="true"
      [autoplay]="{ delay: playTime, disableOnInteraction: false }"
      [pagination]="{ clickable: true }"
      [navigation]="controls"
    >
      <ng-template swiperSlide *ngFor="let slide of slides">
        <img
          class="bg-cover bg-center block h-full w-full"
          [src]="slide.src"
          [alt]="slide.headline"
        />
      </ng-template>
    </swiper>
  `,
  styles: [
    `
      :host::ng-deep {
        .swiper-button-next,
        .swiper-button-prev {
          color: var(--gray-400);
          font-size: 0.1rem;
        }
        .swiper-pagination-bullet-active {
          background: var(--red-500);
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselBannerComponent implements OnInit {
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  @Input() slides: Slide[];
  @Input() controls = false;
  @Input() playTime: number;

  animationInProgress = false;

  ngOnInit(): void {
    this.swiper?.swiperRef.autoplay.start();
  }
}
