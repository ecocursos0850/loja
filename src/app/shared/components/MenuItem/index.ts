import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { LayoutService } from '@shared/services/layout.service';
import { MenuService } from '@shared/services/menu.service';
import {
  NgClass,
  NgForOf,
  NgIf,
  TitleCasePipe,
  UpperCasePipe
} from '@angular/common';

import { Subscription } from 'rxjs';

import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-menuitem]',
  standalone: true,
  template: `
    <ng-container>
      <div
        *ngIf="root && item.visible !== false"
        class="layout-menuitem-root-text flex flex-row justify-content-between align-items-center"
      >
        {{ item.label }}

        <p-button
          [label]="'Limpar' | uppercase"
          size="small"
          [rounded]="true"
          [text]="true"
          [routerLink]="item.routerBaseUrl"
        />
      </div>

      <a
        class="transition-duration-300 hover:surface-hover justify-content-between"
        [ngClass]="item.class"
        *ngIf="(!item.routerLink || item.items) && item.visible !== false"
      >
        <a
          class="transition-colors "
          pRipple
          [attr.href]="item.url"
          routerLinkActive="active-route"
          [queryParams]="item.queryParams"
          [routerLink]="item.routerLink"
          [attr.target]="item.target"
        >
          <i
            [ngClass]="item.icon ?? 'pi pi-caret-right'"
            class="layout-menuitem-icon"
          ></i>
          {{ item.label | titlecase }}
        </a>

        <p-button
          class="p-2"
          styleClass="p-button-raised z-5 p-1 mr-1"
          [rounded]="true"
          [text]="true"
          severity="warning"
          tabindex="0"
          (click)="itemClick($event)"
          *ngIf="item.items?.length"
          pRipple
        >
          <i class="pi pi-fw pi-angle-down layout-submenu-toggler"></i>
        </p-button>
      </a>

      <a
        *ngIf="item.routerLink && !item.items && item.visible !== false"
        (click)="itemClick($event)"
        [ngClass]="item.class"
        [routerLink]="item.routerLink"
        routerLinkActive="active-route"
        [fragment]="item.fragment"
        [queryParamsHandling]="item.queryParamsHandling"
        [preserveFragment]="item.preserveFragment"
        [skipLocationChange]="item.skipLocationChange"
        [replaceUrl]="item.replaceUrl"
        [state]="item.state"
        [queryParams]="item.queryParams"
        [attr.target]="item.target"
        class="py-2 transition-colors transition-duration-300 hover:surface-hover"
        tabindex="0"
        pRipple
      >
        <i
          [ngClass]="item.icon ?? 'pi pi-caret-right'"
          class="layout-menuitem-icon"
        ></i>
        <span class="layout-menuitem-text">{{ item.label | titlecase }}</span>
        <i
          class="pi pi-fw pi-angle-down layout-submenu-toggler"
          *ngIf="item.items"
        ></i>
      </a>

      <ul
        *ngIf="item.items && item.visible !== false"
        [@children]="submenuAnimation"
      >
        <ng-template ngFor let-child let-i="index" [ngForOf]="item.items">
          <li
            app-menuitem
            [item]="child"
            [index]="i"
            [parentKey]="key"
            [class]="child?.badgeClass"
          ></li>
        </ng-template>
      </ul>
    </ng-container>
  `,
  imports: [
    NgClass,
    RouterLink,
    RouterLinkActive,
    NgForOf,
    RippleModule,
    NgIf,
    TitleCasePipe,
    ButtonModule,
    UpperCasePipe
  ],
  animations: [
    trigger('children', [
      state(
        'collapsed',
        style({
          height: '0'
        })
      ),
      state(
        'expanded',
        style({
          height: '*'
        })
      ),
      transition(
        'collapsed <=> expanded',
        animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')
      )
    ])
  ]
})
export class AppMenuitemComponent implements OnInit, OnDestroy {
  categoryRouteId: string | number;

  @Input() item: any;
  @Input() index: number;
  @Input() @HostBinding('class.layout-root-menuitem') root: boolean;
  @Input() parentKey: string;

  active = true;
  menuSourceSubscription: Subscription;
  menuResetSubscription: Subscription;
  key = '';

  constructor(
    public layoutService: LayoutService,
    private cd: ChangeDetectorRef,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private menuService: MenuService
  ) {
    this.menuSourceSubscription = this.menuService.menuSource$.subscribe(
      value => {
        Promise.resolve(null).then(() => {
          if (value.routeEvent) {
            this.active = !!(
              value.key === this.key || value.key.startsWith(`${this.key}-`)
            );
          } else {
            if (
              value.key !== this.key &&
              !value.key.startsWith(`${this.key}-`)
            ) {
              this.active = false;
            }
          }
        });
      }
    );

    this.menuResetSubscription = this.menuService.resetSource$.subscribe(() => {
      this.active = false;
    });
  }

  ngOnInit(): void {
    this.key = this.parentKey
      ? `${this.parentKey}-${this.index}`
      : String(this.index);
  }

  itemClick(event: Event): void {
    if (this.item.disabled) {
      event.preventDefault();
      return;
    }

    if (this.item.command) {
      this.item.command({ originalEvent: event, item: this.item });
    }

    if (this.item.items) {
      this.active = !this.active;
    }

    this.menuService.onMenuStateChange({ key: this.key });

    this.activatedRoute.queryParams.subscribe({
      next: route => {
        this.categoryRouteId = route['id'];
      }
    });
  }

  get submenuAnimation(): string {
    return this.root ? 'expanded' : this.active ? 'expanded' : 'collapsed';
  }

  @HostBinding('class.active-menuitem')
  get activeClass(): boolean {
    return this.active && !this.root;
  }

  ngOnDestroy(): void {
    if (this.menuSourceSubscription) {
      this.menuSourceSubscription.unsubscribe();
    }

    if (this.menuResetSubscription) {
      this.menuResetSubscription.unsubscribe();
    }
  }
}
