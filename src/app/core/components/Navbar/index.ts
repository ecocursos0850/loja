import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  inject,
  signal
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FiltersService } from '@shared/services/filters.service';

import { AutoFocusModule } from 'primeng/autofocus';
import { FocusTrapModule } from 'primeng/focustrap';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';

import { StudentPortalButtonComponent } from '../../../shared/components/StudentPortalButton/index';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RippleModule,
    AutoFocusModule,
    FocusTrapModule,
    StudentPortalButtonComponent,
    ButtonModule,
    NgIf,
    NgFor,
    NgClass
  ],
  template: `
    <nav class="container">
      <div pFocusTrap class="wrapper w-90rem flex align-items-center gap-3">
        <div *ngIf="logo" class="logo"><a href="#">Logo</a></div>
        <input type="radio" name="slider" id="menu-btn" />
        <input type="radio" name="slider" id="close-btn" />
        <p-button
          id="next-btn"
          #nextBtn
          [disabled]="!(scrollValue() > 0)"
          (onClick)="previousFilter()"
          icon="pi pi-chevron-left"
          [rounded]="true"
          class="flex align-items-center"
          [text]="true"
          [raised]="true"
          size="small"
        />
        <ul
          *ngIf="items?.length"
          class="nav-links"
          #filterContainer
          (scroll)="onScroll($event)"
        >
          <app-student-portal-button
            class="w-full flex justify-content-center lg:hidden"
          />
          <label for="close-btn" class="btn close-btn"
            ><i class="pi pi-times"></i
          ></label>
          <li
            *ngFor="let item of items; let indexItem = index"
            (click)="toggleDropItems(item.id)"
            class="filter-link"
            (mouseover)="onMouseOver(indexItem, $event)"
          >
            <ng-container *ngIf="!(item.items?.length > 0)">
              <a
                [queryParams]="item.queryParams"
                [routerLink]="item.routerLink"
                pRipple
                pAutoFocus
                (click)="closeSideBarMobile()"
                >{{ item.label }}</a
              >
            </ng-container>
            <ng-container *ngIf="item.items?.length">
              <a
                pRipple
                href="#"
                class="desktop-item"
                [routerLink]="item.routerLink"
                [queryParams]="item.queryParams"
                pRipple
                >{{ item.label }}
                <i class="pi pi-angle-right"> </i>
              </a>
              <div></div>
              <label class="mobile-item">
                {{ item.label }}
                <i class="pi pi-angle-right"></i>
              </label>
              <ul
                class="drop-menu"
                [id]="'dropShow_' + item.id"
                [style.left.px]="itemWidthRelativeToNav"
              >
                <li *ngFor="let menu of item.items">
                  <a
                    (click)="closeSideBarMobile()"
                    [routerLink]="menu.routerLink"
                    [queryParams]="menu.queryParams"
                    pRipple
                    >{{ menu.label }}</a
                  >
                </li>
              </ul>
            </ng-container>
          </li>
        </ul>
        <label for="menu-btn" class="btn menu-btn"
          ><i class="pi pi-align-justify bold"></i
        ></label>
        <p-button
          id="next-btn"
          #nextBtn
          (onClick)="nextFilter()"
          *ngIf="scrollValue() < 1000"
          icon="pi pi-chevron-right"
          [rounded]="true"
          [text]="true"
          [raised]="true"
          class="flex align-items-center next-button"
          size="small"
        />
      </div>
    </nav>
  `,
  styles: [
    `
      .container {
        position: fixed;
        z-index: 99;
        width: 100%;

        background: var(--indigo-900);
      }

      .container .wrapper {
        position: relative;
        padding: 0px 8px;
        height: 50px;
        line-height: 50px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .wrapper .logo a {
        color: var(--gray-100);
        font-size: 30px;
        font-weight: 600;
        text-decoration: none;
      }
      .wrapper .nav-links {
        display: inline-flex;
      }
      .nav-links {
        width: 100%;
        display: flex;
        justify-content: space-between;
        overflow-x: auto;
        white-space: nowrap;
        padding: 10px;
        gap: 2px;

        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none;

        &::-webkit-scrollbar {
          display: none;
        }

        & a {
          color: var(--gray-100);
          text-decoration: none;
          font-size: 12px;
          font-weight: 500;
          padding: 9px 15px;
          border-radius: 5px;
          transition: all 0.3s ease;
        }

        & a:hover {
          background: var(--surface-ground);

          .dropdown-content {
            display: block;
          }
        }

        li {
          list-style: none;

          i {
            transition: all 0.35s ease;
            font-weight: bold;
            margin-left: 0.5rem;
          }

          a {
            color: var(--gray-100);
            text-decoration: none;
            font-size: 12px;
            font-weight: 500;
            padding: 9px 15px;
            border-radius: 5px;
            transition: all 0.3s ease;

            &:hover {
              background: var(--surface-ground);
            }
          }

          &:hover {
            a {
              color: var(--red-600);
              font-weight: bold;
            }
            i {
              transform: rotate(90deg);
              color: var(--red-600);
            }

            .drop-menu a {
              color: var(--gray-100);
              font-weight: normal;
            }
          }
        }
      }

      .nav-links .mobile-item {
        display: none;
      }
      .nav-links .drop-menu {
        position: absolute;
        z-index: 99;
        background: var(--indigo-900);
        width: 180px;
        max-height: 70vh !important;
        line-height: 45px;
        top: 85px;
        opacity: 0;
        visibility: hidden;
        box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);

        overflow-y: auto;
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none;

        &::-webkit-scrollbar {
          display: none;
        }
      }

      .nav-links li:hover .drop-menu {
        overflow-x: auto;
        transition: all 0.3s ease;
        top: 50px;
        opacity: 1;
        visibility: visible;
      }
      .drop-menu li a {
        width: 100%;
        display: block;
        padding: 0 0 0 15px;
        font-weight: 400;
        border-radius: 0px;

        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;

        &:hover {
          color: var(--red-600) !important;
          font-weight: 500 !important;
        }
      }
      .wrapper .btn {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        display: none;
      }
      .wrapper .btn.close-btn {
        position: absolute;
        right: 30px;
        top: 10px;
      }

      @media screen and (max-width: 990px) {
        .wrapper .btn {
          display: block;
        }
        .wrapper .nav-links {
          position: fixed;
          height: 100vh;
          width: 100%;
          max-width: 350px;
          top: 0;
          left: -100%;
          background: var(--indigo-900);
          display: block;
          padding: 50px 10px;
          line-height: 50px;
          overflow-y: auto;
          box-shadow: 0px 15px 15px rgba(0, 0, 0, 0.18);
          transition: all 0.3s ease;
        }
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: var(--indigo-900);
        }
        ::-webkit-scrollbar-thumb {
          background: var(--gray-900);
        }
        #menu-btn:checked ~ .nav-links {
          left: 0%;
        }
        #menu-btn:checked ~ .btn.menu-btn {
          display: none;
        }
        .nav-links li {
          margin: 15px 10px;
        }
        .nav-links li a {
          padding: 0 20px;
          display: block;
          font-size: 20px;
        }
        .nav-links .drop-menu {
          position: static;
          opacity: 1;
          top: 65px;
          visibility: visible;
          padding-left: 20px;
          width: 100%;
          max-height: 0px;
          overflow: hidden;
          box-shadow: none;
          transition: all 0.3s ease;
        }
        .nav-links .desktop-item {
          display: none !important;
        }
        .nav-links .mobile-item {
          display: block;
          color: var(--gray-100);
          font-size: 18px;
          font-weight: 500;
          padding-left: 20px;
          cursor: pointer;
          border-radius: 5px;
          transition: all 0.3s ease;
        }
        .nav-links .mobile-item:hover {
          color: var(--red-600);
          background: var(--gray-100);
          font-weight: bold;
          i {
            transform: rotate(90deg);
            color: var(--red-600);
          }

          .drop-menu a {
            color: var(--gray-100);
            font-weight: normal;
          }
        }
        .drop-menu li {
          margin: 0;
        }
        .drop-menu li a {
          border-radius: 5px;
          font-size: 18px;
        }
        .next-button {
          display: none !important;
        }
      }
      nav input {
        display: none;
      }
    `
  ]
})
export class NavbarComponent implements OnInit {
  @ViewChild('nextBtn') nextBtn!: ElementRef;
  @ViewChild('filterContainer') filterContainer!: ElementRef;

  @Input() logo = '';
  @Input() hasIcons = false;
  @Input() hasLinkToItems = true;
  @Input() typeMenu = 'navbar';
  @Input() label = '';

  scrollPosition = 0;
  items: any[] = [];
  showChildrens = false;
  showChildrensMap = new Map<string, string>();
  submenuAnimation: string;
  currentIndex = 0;
  itemWidthRelativeToNav = 0;
  filterWidth = 200;

  scrollValue = signal<number>(0);

  private filtersService = inject(FiltersService);
  private ref = inject(ElementRef);
  private renderer = inject(Renderer2);

  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void {
    this.scrollValue.update(() => (event.target as HTMLElement).scrollLeft);
  }

  ngOnInit(): void {
    this.filtersService
      .getFilters(this.hasIcons, this.hasLinkToItems, this.typeMenu, this.label)
      .subscribe({
        next: res => {
          console.log(res.forEach(x => console.log(x)))
          this.items = res;
        }
      });
  }

  onMouseOver(index: number, event: MouseEvent): void {
    const navElement = this.filterContainer.nativeElement.parentElement;
    const navRect = navElement.getBoundingClientRect();
    const itemRect = (event.target as HTMLElement).getBoundingClientRect();

    this.itemWidthRelativeToNav = itemRect.left - navRect.left;
  }

  closeSideBarMobile(): void {
    const bar = this.ref.nativeElement.querySelector(`#close-btn`);
    bar.click();
  }

  nextFilter(): void {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.scrollPosition = this.currentIndex * this.filterWidth;
    this.filterContainer.nativeElement.scrollTo({
      left: this.scrollPosition,
      behavior: 'smooth'
    });
  }

  previousFilter(): void {
    this.currentIndex = (this.currentIndex - 1) % this.items.length;
    this.scrollPosition = this.currentIndex * this.filterWidth;
    this.filterContainer.nativeElement.scrollTo({
      left: this.scrollPosition,
      behavior: 'smooth'
    });
  }

  toggleDropItems(id: number | string): void {
    const drop = this.ref.nativeElement.querySelector(`#dropShow_${id}`);
    const currentState =
      this.showChildrensMap.get(id.toString()) || 'collapsed';
    const newState = currentState === 'collapsed' ? 'expanded' : 'collapsed';

    this.showChildrensMap.set(id.toString(), newState);

    if (newState === 'expanded') {
      this.renderer.addClass(drop, 'max-h-full');
    } else {
      this.renderer.removeClass(drop, 'max-h-full');
    }
  }
}
