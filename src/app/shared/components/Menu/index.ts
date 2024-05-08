import { Component, inject, Input, OnInit } from '@angular/core';
import { AppMenuitemComponent } from '@shared/components/MenuItem';
import { CommonModule, NgIf } from '@angular/common';
import { FiltersService } from '@shared/services/filters.service';

import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    AppMenuitemComponent,
    MenubarModule,
    NgIf,
    CommonModule,
    ButtonModule
  ],
  template: `
    <div>
      <ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
          <li
            app-menuitem
            *ngIf="!item.separator"
            [item]="item"
            [index]="i"
            [root]="true"
          ></li>
          <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
      </ul>
    </div>
  `
})
export class AppMenuComponent implements OnInit {
  @Input() hasLinkToItems = false;
  @Input() hasIcons = false;
  @Input() label: string;

  model: any[] = [];

  private filtersService = inject(FiltersService);

  ngOnInit(): void {
    this.filtersService
      .getFilters(this.hasIcons, this.hasLinkToItems, 'sidebar', this.label)
      .subscribe({
        next: res => (this.model = res)
      });
  }
}
