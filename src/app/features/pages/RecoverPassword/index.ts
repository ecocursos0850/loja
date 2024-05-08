import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'page-recover-password',
  standalone: true,
  imports: [ButtonModule, InputTextModule, ReactiveFormsModule],
  template: `
    <div class="flex flex-1 align-items-center justify-content-center flex-column w-90rem m-auto min-h-full px-4 fadeinleft animation-duration-1000">
      <div class="flex flex-1 flex-column align-items-center w-full max-w-62rem my-5 p-1 sm:p-5">
        <div class="flex-1 flex align-items-center justify-content-center w-full pt-6 pb-8 px-0">
          <div class="w-full">
            <div class="w-full flex justify-content-center flex-column md:flex-row">
              <form [formGroup]="form" (ngSubmit)="onSubmit(form)" class="bg-white w-full border-round-lg p-3 sm:p-5 md:p-7">
                <section class="grid m-0 w-full">
                  <div class="w-full mb-6">
                    <h1 class="text-3xl sm:text-5xl font-bold text-900 text-center">Recuperar senha</h1>
                  </div>
                  <div class="mt-4 text-center">
                <p>
                  Para recuperar sua senha, por favor, entre em contato conosco em
                  <a href="mailto:contato@ecocursos.com.br">contato@ecocursos.com.br</a>.
                </p>
              </div>
                </section>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RecoverPasswordPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  form: FormGroup;

  ngOnInit(): void {
    this.configFormValues();
  }

  configFormValues(): void {
    this.form = this.fb.group({
      email: ['', Validators.required]
    });
  }

  onSubmit(createMemberProps: FormGroup): void {
    // Lógica de recuperação de senha, se necessário.
  }
}
