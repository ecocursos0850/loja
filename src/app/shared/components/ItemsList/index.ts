import { Component, inject, OnInit } from '@angular/core';
import { cartItemsSelector } from '@shared/store/reducers/cart.reducer';
import { CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { CartType } from '@shared/models/classes/cart-market.model';

import { Store } from '@ngrx/store';
import { DividerModule } from 'primeng/divider';

import { GetDirectoryImage } from '../../pipes/convert-base64.pipe';

@Component({
  selector: 'app-items-list',
  standalone: true,
  template: `
    <div
      *ngFor="let item of itemsList"
      class="flex flex-column align-items-center justify-content-between w-full surface-ground border-round-lg mb-2"
    >
      <div class="flex flex-row justify-content-between w-full p-2 ">
        <div class="flex flex-row gap-2 w-full">
          <img
            *ngIf="item.capa; else noImage"
            class="max-w-4rem border-round-lg shadow-1"
            [src]="item.capa | directory_image"
            [alt]="item.titulo"
          />
          <div class="flex flex-column gap-1 ">
            <span class="text-sm font-bold text-ellipsis">{{
              item.titulo
            }}</span>
            <span class="text-xs text-700">{{ item.tipoCurso }}</span>
          </div>
        </div>

        <div class="w-10rem flex align-items-start justify-content-center">
          <span class="text-sm font-bold m-0">{{ item.preco | currency }}</span>
        </div>
      </div>
    </div>

    <ng-template #noImage>
      <img
        class="max-w-4rem border-round-lg shadow-1"
        src="../../../../assets/images/no-image.svg"
        alt="no-data"
      />
    </ng-template>
  `,
  styles: [
    `
      .text-ellipsis {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
      }
    `
  ],
  imports: [NgForOf, CurrencyPipe, DividerModule, NgIf, GetDirectoryImage]
})
export class CartItemsComponent implements OnInit {
  private store = inject(Store);

  itemsList: CartType[] = [];
  ngOnInit(): void {
    this.store.select(cartItemsSelector).subscribe({
      next: items => (this.itemsList = items)
    });
  }
}
