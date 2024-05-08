import { Component, OnInit, inject, signal } from '@angular/core';
import { DiscountCouponActions } from '@shared/store/actions/discount-coupon.actions';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { discountCouponSelectError } from '@shared/store/reducers/discount-coupon.reducer';

import { Store } from '@ngrx/store';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-coupon',
  standalone: true,
  imports: [InputTextModule, ButtonModule, FormsModule, NgClass, NgIf],
  template: `
    <span> Cada produto pode ter apenas um cupom aplicado. </span>
    <div class="mt-4">
      <div class="p-inputgroup">
        <input
          [(ngModel)]="couponValue"
          type="text"
          pInputText
          (keypress)="clearValidation()"
          [ngClass]="isInvalid() ? 'ng-invalid ng-dirty' : ''"
          placeholder="Digite seu cupom"
        />
        <button
          [disabled]="couponValue === ''"
          type="button"
          pButton
          (click)="getDiscountCoupon()"
          [loading]="isLoading()"
          label="Aplicar"
        ></button>
      </div>
      <small *ngIf="isInvalid()" class="text-red-600 bold text-sm"
        >Insira um cupom válido</small
      >
    </div>
  `
})
export class CouponComponent implements OnInit {
  couponValue = '';
  isInvalid = signal(false);
  isLoading = signal(false);

  private store = inject(Store);

  ngOnInit(): void {
    this.store.select(discountCouponSelectError).subscribe({
      next: err => {
        if (err) {
          this.isInvalid.update(() => true);
          this.isLoading.update(() => false);
        }
      }
    });
  }

  clearValidation(): void {
    this.isInvalid.update(() => false);
  }

  getDiscountCoupon(): void {
    this.isLoading.update(() => true);
    this.store.dispatch(
      DiscountCouponActions.selectCoupon({ id: this.couponValue })
    );
  }
}
