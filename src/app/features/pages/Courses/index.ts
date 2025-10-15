import { Component, OnDestroy, Renderer2, ViewChild, Input } from '@angular/core';
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
          <div class="layout-main border-round-xl">
            <div class="absolute bottom-0 top-0 lg:hidden">
              <button
                #menubutton
                pRipple
                class="p-link layout-menu-button bg-red-600 layout-topbar-button
                shadow-2 text-center text-white font-bold toogle-button"
                (click)="layoutService.onMenuToggle()"
              >
                <i class="pi pi-chevron-right"></i>
              </button>
            </div>
            
            <!-- Área dos cards de curso - EXEMPLO -->
            <div class="course-cards-container p-4">
              <div class="grid">
                <!-- Exemplo de card de curso -->
                <div class="col-12 md:col-6 lg:col-4" *ngFor="let course of courses$ | async">
                  <div class="course-card border-1 surface-border border-round surface-card p-3">
                    <div class="course-image mb-3">
                      <img [src]="course.image" [alt]="course.title" class="w-full border-round" />
                    </div>
                    <h3 class="text-xl font-bold mb-2">{{ course.title }}</h3>
                    <p class="text-gray-600 mb-3">{{ course.description }}</p>
                    <div class="flex justify-content-between align-items-center">
                      <span class="text-2xl font-bold text-primary">{{ course.price }}</span>
                      <div class="flex gap-2">
                        <!-- Botão Adicionar ao Carrinho -->
                        <button
                          pButton
                          pRipple
                          icon="pi pi-shopping-cart"
                          class="p-button-success p-button-sm"
                          (click)="addToCart(course)"
                          label="Adicionar"
                        ></button>
                        
                        <!-- Botão Compartilhar no Facebook -->
                        <button
                          pButton
                          pRipple
                          icon="pi pi-facebook"
                          class="p-button-primary p-button-sm"
                          (click)="shareOnFacebook(course)"
                          label="Compartilhar"
                        ></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

      .course-card {
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .course-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
    `
  ]
})
export class LayoutComponent implements OnDestroy {
  overlayMenuOpenSubscription: Subscription;
  menuOutsideClickListener: any;
  profileMenuOutsideClickListener: any;

  @ViewChild(SidebarComponent) appSidebar!: SidebarComponent;

  // Exemplo de observable para os cursos
  courses$ = this.store.select(courseSelectorCollection);

  constructor(
    public layoutService: LayoutService,
    public renderer: Renderer2,
    public router: Router,
    private store: Store
  ) {
    this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
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

  // Método para compartilhar no Facebook
  shareOnFacebook(course: any): void {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Confira este curso: ${course.title} - ${course.description}`);
    
    // URL de compartilhamento do Facebook
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
    
    // Abre a janela de compartilhamento
    window.open(
      facebookShareUrl,
      'facebook-share-dialog',
      'width=800,height=600'
    );
  }

  // Método para adicionar ao carrinho
  addToCart(course: any): void {
    // Implemente a lógica para adicionar ao carrinho aqui
    console.log('Curso adicionado ao carrinho:', course);
    // this.store.dispatch(addToCartAction({ course }));
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