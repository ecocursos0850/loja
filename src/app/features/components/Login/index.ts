import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginActions } from '@shared/store/actions/auth.actions';
import {
  loginSelectError,
  loginSelectGettingStatus
} from '@shared/store/reducers/auth.reducer';
import { NgClass, NgIf } from '@angular/common';

import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Store } from '@ngrx/store';

@Component({
  selector: 'page-login',
  standalone: true,
  imports: [
    PasswordModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    RouterLink,
    NgIf,
    NgClass
  ],
  template: `
    <div
      class="
      flex flex-1 align-items-center
      justify-content-center flex-column w-90rem m-auto min-h-full  px-4
      fadeinleft animation-duration-1000
  "
    >
      <div
        class="flex flex-1 flex-column align-items-center w-full max-w-62rem my-5 p-5"
      >
        <div
          class="flex-1 flex align-items-center justify-content-center w-full pt-6 pb-8 px-0"
        >
          <div class="w-full">
            <div
              class="w-full flex justify-content-between flex-column gap-4 md:flex-row"
            >
              <div
                class="w-full flex flex-column justify-content-center md:align-self-center max-w-30rem"
              >
                <img
                  class="max-w-16rem md:max-w-20rem mb-3 md:mb-5"
                  src="../../../../assets/images/Logo1.png"
                  alt="logo"
                />
                <h1
                  class="text-3xl md:text-6xl mb-3 text-center md:text-left md:m-0 font-bold text-800"
                >
                  Faça seu login <br />na plataforma
                </h1>
              </div>
              <form
                [formGroup]="form"
                (ngSubmit)="onSubmit(form)"
                class="bg-white w-fullborder border-round-lg p-5 md:p-7"
              >
                <div class="w-full text-center">
                  <span
                    [ngClass]="
                      isAccessFiled()
                        ? 'text-red-600 text-base font-bold'
                        : 'hidden'
                    "
                  >
                    * Senha ou Email incompatível
                  </span>
                </div>
                <section class="grid m-0 w-full gap-3">
                  <div class="w-full gap-5">
                    <small class="text-sm text-500">Informe seu e-mail</small>
                    <div class="flex flex-column relative">
                      <input
                        id="email"
                        pInputText
                        placeholder="Digite seu Email"
                        class="w-full"
                        aria-describedby="email"
                        formControlName="email"
                      />
                      <small
                        class="absolute text-red-600 left-0"
                        style="bottom: -22px"
                        [ngClass]="
                          form.get('email')!.hasError('email') &&
                          form.get('email')!.touched
                            ? ''
                            : 'hidden'
                        "
                      >
                        *Digite um email válido
                      </small>
                    </div>
                  </div>
                  <div class="mt-3 w-full">
                    <div class="mb-2">
                      <small class="text-sm text-500">Senha</small>
                      <p-password
                        id="password"
                        aria-describedby="password"
                        formControlName="password"
                        [style]="{ width: '100%' }"
                        class="w-full"
                        placeholder="Digite sua senha"
                        inputStyleClass="w-full"
                        [feedback]="false"
                        [toggleMask]="true"
                      />
                    </div>
                   <a
                  href="https://recuperar.ecocursos.com.br/"
                  class="text-bold text-sm text-red-600 transition-all font-bold transition-duration-500 hover:text-red-400"
                  >
                  Esqueceu a senha?
                </a>
                  </div>
                  <div class="mt-4 flex w-full justify-content-center">
                    <p-button
                      class="w-full"
                      type="submit"
                      [styleClass]="'w-full'"
                      label="Entrar"
                      [disabled]="!form.valid"
                    />
                  </div>
                  <div class="mt-4 flex w-full justify-content-center">
                    <small
                      >Não tem uma conta?
                      <a
                        [routerLink]="'/cadastro'"
                        class="text-bold text-sm text-red-600
                    transition-all font-bold transition-duration-500 hover:text-red-400"
                      >
                        Registre-se</a
                      >.</small
                    >
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
export class LoginPageComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  isLoading = signal<boolean>(false);
  isAccessFiled = signal<boolean>(false);

  form: FormGroup;

  ngOnInit(): void {
    this.configFormValues();

    this.store.dispatch(LoginActions.enter());

    this.store.select(loginSelectGettingStatus).subscribe({
      next: status => this.isLoading.update(() => status)
    });

    this.checkStudentExistence();
    this.stopLoading();
  }

  checkStudentExistence(): void {
    this.store.select(loginSelectError).subscribe({
      next: err => {
        if (err?.status === 403) this.isAccessFiled.update(() => true);
      }
    });
  }

  stopLoading(): void {
    this.store.select(loginSelectError).subscribe({
      next: err => {
        if (err) this.isLoading.update(() => false);
      }
    });
  }

  configFormValues(): void {
    this.form = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email, this.emailDomainValidator]
      ],
      password: ['', Validators.required]
    });
  }

  emailDomainValidator(control: FormControl): any {
    const email = control.value;
    if (email && email.indexOf('@') !== -1) {
      const [_, domain] = email.split('@');
      if (domain !== 'example.com') {
        return null;
      }
    }
    return { invalidEmailDomain: true };
  }

  onSubmit(authProps: FormGroup): void {
    const userValue = authProps.value;
    const userFormValue = {
      ...userValue
    };

    this.store.dispatch(LoginActions.login({ user: userFormValue }));
  }
}
