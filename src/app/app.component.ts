import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoadingComponent } from '@shared/components/Loading';
import { ModalComponent } from '@shared/components/Modal';

import { PrimeNGConfig } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';

import { LandingPageComponent } from './features/pages/LandingPage';
import { HeaderComponent } from './core/components/Header';
import { FooterComponent } from './core/components/Footer';
import { MessageComponent } from './shared/components/Message';
import { NavbarComponent } from './core/components/Navbar';
@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-message #MessageComponent />
    <app-loading #LoadingComponent />
    <app-modal #ModalComponent />

    <div class="min-w-15rem">
      <div
        class="fixed top-0 left-0 right-0 header-transform w-full z-5"
        [ngClass]="{ 'header-hidden': isHeaderHidden }"
      >
        <app-header />
        <app-navbar />
      </div>
      <main class="m-auto flex-header">
        <router-outlet></router-outlet>
      </main>
      <app-footer class="mt-3" />
    </div>
  `,
  styles: [
    `
      .flex-header {
        @media screen and (max-width: 500px) {
          margin-top: 13.2rem !important;
        }
        @media screen and (max-width: 770px) {
          margin-top: 14.17rem !important;
        }
        @media screen and (min-width: 780px) {
          margin-top: 9.6rem !important;
        }
        @media screen and (min-width: 995px) {
          margin-top: 9.7rem !important; // Remove after
        }
      }

      .header-transform {
        transition: transform 0.1s ease-in;
      }

      .header-hidden {
        @media screen and (max-width: 560px) {
          transform: translateY(-100%);
          transition: transform 0.6s ease-out;
        }
      }
    `
  ],
  imports: [
    LandingPageComponent,
    RouterOutlet,
    RouterModule,
    CommonModule,
    HeaderComponent,
    FooterComponent,
    MessageComponent,
    LoadingComponent,
    MessagesModule,
    NavbarComponent,
    ModalComponent
  ]
})
export class AppComponent implements OnInit {
  @ViewChild('MessageComponent') messageComponent?: MessageComponent;
  @ViewChild('LoadingComponent') loadingComponent?: LoadingComponent;
  @ViewChild('ModalComponent') modalComponent?: ModalComponent;

  private primengConfig = inject(PrimeNGConfig);
  isHeaderHidden = false;

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }
}
