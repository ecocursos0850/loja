import { Component, ElementRef, inject } from '@angular/core';
import { LayoutService } from '@shared/services/layout.service';
import { AppMenuComponent } from '@shared/components/Menu';
import { AsyncPipe, NgIf } from '@angular/common';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AppMenuComponent, ButtonModule, NgIf, AsyncPipe],
  template: `
    <app-menu
      [hasIcons]="true"
      [hasLinkToItems]="true"
      typeMenu="sidebar"
      label="Filtros"
    />
  `
})
export class SidebarComponent {
  layoutService = inject(LayoutService);
  el = inject(ElementRef);
}
