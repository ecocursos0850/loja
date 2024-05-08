import { Component, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { LayoutService } from '@shared/services/layout.service';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { courseSelectorCollection } from '@shared/store/reducers/courses.reducer';

import { filter, Subscription } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Store } from '@ngrx/store';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { SidebarComponent } from '../../../core/components/Sidebar';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    NgClass,
    SidebarComponent,
    ProgressSpinnerModule,
    ButtonModule,
    SkeletonModule,
    RouterOutlet,
    RippleModule,
    NgIf
  ],
  template: `
    <div class="w-full bg-red-600">
      <div class="w-90rem flex gap-3 align-items-center m-auto">
        <h1 class="p-4 text-2xl text-white font-bold m-0">Todos os cursos</h1>
      </div>
    </div>
    <div class="w-90rem m-auto relative">
      <div class="layout-wrapper" [ngClass]="containerClass">
        <div class="layout-sidebar flex justify-content-center">
          <p-progressSpinner
            styleClass="w-3rem h-3rem"
            *ngIf="!hasCoursesItems()"
            strokeWidth="8"
            fill="var(--surface-ground)"
            animationDuration=".8s"
          />
          <app-sidebar *ngIf="hasCoursesItems()" />
        </div>
        <div class="layout-main-container border-round-xl">
          <div class="layout-main  border-round-xl">
            <div class="absolute bottom-0 top-0 lg:hidden">
              <button
                #menubutton
                pRipple
                class="p-link layout-menu-button bg-red-600 layout-topbar-button
              shadow-2 text-center text-white font-bold toogle-button"
                (click)="layoutService.onMenuToggle()"
              >
                <i class="pi pi-chevron-right "></i>
              </button>
            </div>
            <router-outlet></router-outlet>
          </div>
        </div>
        <div class="layout-mask"></div>
      </div>
    </div>
  `,
  styles: [
    `
      .toogle-button {
        display: block;
        position: fixed;
        width: 3rem;
        height: 3rem;
        top: 50%;
        left: 0;
        border-radius: 0px 16px 16px 0 !important;
      }
    `
  ]
})

// TODO Replace name for CoursesLayoutComponent
export class LayoutComponent implements OnDestroy {
  overlayMenuOpenSubscription: Subscription;

  menuOutsideClickListener: any;

  profileMenuOutsideClickListener: any;

  @ViewChild(SidebarComponent) appSidebar!: SidebarComponent;

  constructor(
    public layoutService: LayoutService,
    public renderer: Renderer2,
    public router: Router,
    private store: Store
  ) {
    this.overlayMenuOpenSubscription =
      this.layoutService.overlayOpen$.subscribe(() => {
        if (!this.menuOutsideClickListener) {
          this.menuOutsideClickListener = this.renderer.listen(
            'document',
            'click',
            event => {
              const isOutsideClicked = !(
                this.appSidebar.el.nativeElement.isSameNode(event.target) ||
                this.appSidebar.el.nativeElement.contains(event.target)
              );
              if (isOutsideClicked) {
                this.hideMenu();
              }
            }
          );
        }

        if (this.layoutService.state.staticMenuMobileActive) {
          this.blockBodyScroll();
        }
      });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.hideMenu();
        this.hideProfileMenu();
      });
  }

  hasCoursesItems(): boolean {
    let hasCourses = false;
    this.store.select(courseSelectorCollection).subscribe({
      next: courses => {
        hasCourses = courses.length ? true : false;
      }
    });

    return hasCourses;
  }

  hideMenu(): void {
    this.layoutService.state.overlayMenuActive = false;
    this.layoutService.state.staticMenuMobileActive = false;
    this.layoutService.state.menuHoverActive = false;
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
      this.menuOutsideClickListener = null;
    }
    this.unblockBodyScroll();
  }

  hideProfileMenu(): void {
    this.layoutService.state.profileSidebarVisible = false;
    if (this.profileMenuOutsideClickListener) {
      this.profileMenuOutsideClickListener();
      this.profileMenuOutsideClickListener = null;
    }
  }

  blockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.add('blocked-scroll');
    } else {
      document.body.className += ' blocked-scroll';
    }
  }

  unblockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.remove('blocked-scroll');
    } else {
      document.body.className = document.body.className.replace(
        new RegExp(
          `(^|\\b)${'blocked-scroll'.split(' ').join('|')}(\\b|$)`,
          'gi'
        ),
        ' '
      );
    }
  }

  get containerClass(): any {
    return {
      'layout-theme-light': this.layoutService.config.colorScheme === 'light',
      'layout-theme-dark': this.layoutService.config.colorScheme === 'dark',
      'layout-overlay': this.layoutService.config.menuMode === 'overlay',
      'layout-static': this.layoutService.config.menuMode === 'static',
      'layout-static-inactive':
        this.layoutService.state.staticMenuDesktopInactive &&
        this.layoutService.config.menuMode === 'static',
      'layout-overlay-active': this.layoutService.state.overlayMenuActive,
      'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
      'p-input-filled': this.layoutService.config.inputStyle === 'filled',
      'p-ripple-disabled': !this.layoutService.config.ripple
    };
  }

  ngOnDestroy(): void {
    if (this.overlayMenuOpenSubscription) {
      this.overlayMenuOpenSubscription.unsubscribe();
    }

    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
    }
  }
}
