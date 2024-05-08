import { Injectable } from '@angular/core';
import { CartType } from '@shared/models/classes/cart-market.model';

import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'cart';
  private cartArray: CartType[] = [];

  getCartItems(): Observable<CartType[]> {
    const dataValue = localStorage.getItem(this.cartKey);
    return dataValue
      ? JSON.parse(dataValue)
      : throwError((err: Error) => console.error(err));
  }

  setCartItems(cart: CartType): Observable<CartType[]> {
    const cartArray: CartType[] = JSON.parse(
      localStorage.getItem(this.cartKey) || '[]'
    );
    cartArray.push(cart);

    localStorage.setItem(this.cartKey, JSON.stringify(cartArray));

    return of(cartArray);
  }
}
