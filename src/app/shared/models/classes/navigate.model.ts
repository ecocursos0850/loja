import { Router } from '@angular/router';
import { inject } from '@angular/core';

export class NavigateModel {
  private router = inject(Router);
  page: string;

  constructor(page: string) {
    this.page = page;
  }

  navigateToRouter(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    this.router.navigate(['login']);
  }
}
