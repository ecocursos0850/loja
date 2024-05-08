import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

export interface MenuChangeEvent {
  key: string;
  routeEvent?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuSource = new Subject<MenuChangeEvent>();
  private resetSource = new Subject();

  menuSource$ = this.menuSource.asObservable();
  resetSource$ = this.resetSource.asObservable();

  onMenuStateChange(event: MenuChangeEvent): void {
    this.menuSource.next(event);
  }

  reset(): void {
    this.resetSource.next(true);
  }
}
