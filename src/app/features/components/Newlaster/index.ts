import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-newlaster',
  standalone: true,
  imports: [InputTextModule, ReactiveFormsModule, FormsModule],
  template: `
    <div
      class="grid m-0 justify-content-center text-center lg:pt-5 p-2 pb-7 sm:mt-6 md:mt-7 mt-7
            bg-red-600 w-full border-round-3xl text-white px-2"
    >
      <span class="col-12 line-height-4 sm:text-base lg:text-base text-sm"
        >Inscreva seu e-mail em nosso Newsletter e fique por dentro das
        novidades.</span
      >
      <span
        class="col-12 lg:col-12 lg:text-5xl md:text-4xl text-xl sm:text-3xl font-bold"
        >Receba as Nossas Novidades</span
      >

      <div
        class="lg:col-6 md:col-6 sm:col-6 col-12 mt-3 animation-iteration-infinite"
      >
        <span class="p-input-icon-right w-full shadow-5">
          <i class="pi pi-angle-right font-bold"></i>
          <input
            class="w-full lg:py-3 md:py-3 sm:py-3"
            type="text"
            pInputText
            placeholder="Email"
            [(ngModel)]="value"
          />
        </span>
      </div>
    </div>
  `
})
export class NewlasterComponent {
  value: string;
}
