import { Component, inject, OnInit } from '@angular/core';
import { cardNavigationSelectCurrentPage } from '@shared/store/reducers/card-navigation.reducer';
import { TitleCasePipe } from '@angular/common';

import { Store } from '@ngrx/store';

@Component({
  selector: 'app-card-navigation',
  standalone: true,
  imports: [TitleCasePipe],
  template: `
    <div class="w-full bg-red-600 h-full">
      <div class="w-90rem m-auto">
        <h1 class="p-4 text-2xl text-white font-bold">
          {{ pageName | titlecase }}
        </h1>
      </div>
    </div>
  `
})
export class CardNavigationComponent implements OnInit {
  private store = inject(Store);

  pageName: string;

  ngOnInit(): void {
    this.store.select(cardNavigationSelectCurrentPage).subscribe({
      next: page => {
        if (page) this.pageName = page;
      }
    });
  }
}
