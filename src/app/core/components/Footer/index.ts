import { Component } from '@angular/core';
import { NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import { Constants } from '../../../shared/utils/constants';

interface RouteFooterType {
  link: string;
  label?: string;
  image?: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ButtonModule, NgForOf, RouterLink],
  template: ` <footer class="w-full mt-3 p-3 bg-indigo-900">
    <div class="grid mt-12 max-w-62rem m-auto">
      <div class="col-12 sm:col-6 md:col-5">
        <div class="flex align-items-center mb-2 sm:mb-5 gap-2">
          <img
            class="w-2rem sm:w-2rem md:w-3rem lg:w-3rem"
            src="../../../../assets/images/icon-footer.svg"
          />
          <span class="text-sm sm:text-base md:text-lg font-bold text-white"
            >Atendimento</span
          >
        </div>
        <div class="line-height-3">
          <li
            *ngFor="let attendence of attendences"
            class="text-xs text-400 sm:text-sm md:text-base"
          >
            {{ attendence.description }}
          </li>
        </div>
      </div>
      <div class="col-6 sm:col-5 md:col-3">
        <div
          class="mb-2 sm:mb-5 flex align-items-center
          h-2rem sm:h-2rem md:h-3rem lg:h-3rem"
        >
          <span
            class="text-sm sm:text-base md:text-lg  font-bold md:text-lg text-white"
            >Serviços</span
          >
        </div>
        <li
          class="text-xs sm:text-sm md:text-base text-400"
          *ngFor="let service of services"
        >
          <a
            [routerLink]="service.link"
            class="underline text-xs sm:text-sm md:text-base line-height-3
                transition-colors transition-duration-500
                text-400 hover:text-red-400"
            >{{ service.label }}</a
          >
        </li>
      </div>
      <div class="col-5 sm:col-12 md:col-4">
        <div>
          <div
            class="flex align-items-center mb-2 sm:mb-5 h-2rem sm:h-2rem md:h-3rem"
          >
            <span class="font-bold text-sm sm:text-base md:text-lg text-white"
              >Fale Conosco</span
            >
          </div>
          <div>
            <li
              class="text-xs sm:text-sm md:text-base text-400"
              *ngFor="let contact of contactUs"
            >
              <a
                [href]="contact.link"
                class="underline text-xs sm:text-sm md:text-base line-height-3
                transition-colors transition-duration-500
                text-400 hover:text-red-400"
                >{{ contact.label }}</a
              >
            </li>
          </div>
        </div>
        <div class="mt-3">
          <div
            class="flex align-items-center sm:mt-0 mb-2 sm:mb-5 h-2rem
              sm:h-2rem md:h-3rem"
          >
          </div>
          <div class="text-xs sm:text-sm md:text-base text-400 line-height-3">
            <li
              class="text-xs sm:text-sm md:text-base text-400"
              *ngFor="let inst of institutional"
            >
              <a
                [href]="inst.link"
                class="underline text-xs sm:text-sm md:text-base line-height-3
                transition-colors transition-duration-500
                text-400 hover:text-red-400"
                >{{ inst.label }}</a
              >
            </li>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-3 max-w-62rem m-auto border-top-1 border-white">
      <img class="pt-3 w-full" src="../../../../assets/images/cards.png" />
    </div>

    <div
      class="grid text-base text-indigo-100 mt-6
       max-w-62rem justify-content-between m-auto align-items-center lg:flex-row
       sm:flex-column-reverse flex-column-reverse"
    >
      <span class="text-center text-sm lg:col-2 md:col-3 sm:col-12"
        >© 2023 Todos os direitos reservados.</span
      >
      <div
        class="lg:col-8 md:col-9 sm:col-12 flex justify-content-center gap-2 flex-wrap"
      >
        <a
          *ngFor="let router of routersFooter"
          class="text-sm text-indigo-100 transition-colors transition-duration-500 text-400 hover:text-red-400"
          [routerLink]="router.link"
          >{{ router.label }}</a
        >
      </div>
      <div
        class="lg:col-2 md:col-6 sm:col-12 sm:justify-content-center flex gap-1"
      >
        <a
          *ngFor="let social of socialMedias"
          [href]="social.link"
          target="_blank"
          ><img style="width: 2rem" [src]="social.image"
        /></a>
      </div>
    </div>
  </footer>`
})
export class FooterComponent {
  attendences = Constants.FooterConstants.attendences;
  services: RouteFooterType[] = Constants.FooterConstants.services;
  contactUs: RouteFooterType[] = Constants.FooterConstants.contactUs;
  institutional: RouteFooterType[] = Constants.FooterConstants.institutional;
  routersFooter: RouteFooterType[] = Constants.FooterConstants.routersFooter;
  socialMedias: RouteFooterType[] = Constants.FooterConstants.socialMedias;
}
