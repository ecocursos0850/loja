import {
  Component,
  effect,
  inject,
  Injector,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IbgeInformationActions } from '@shared/store/actions/cep-information.actions';
import { ibgeInformationSelector } from '@shared/store/reducers/ibge.reducer';
import { IbgeInterfaceModel } from '@shared/models/classes/ibge.interface.model';
import { Router, RouterLink } from '@angular/router';
import { RegisterService } from '@shared/services/register.service';
import { RegisterType } from '@shared/models/interface/register.interface';
import { CPFGenericValidator } from '@shared/models/classes/cpf-validator.model';
import { FormatDate } from '@shared/models/classes/format-date.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageAction } from '@shared/store/actions/message.actions';
import { formatDate } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { Store } from '@ngrx/store';
import { CalendarModule } from 'primeng/calendar';

interface DropType {
  name: string;
  code: string;
}

@Component({
  selector: 'page-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    FormsModule,
    CommonModule,
    RouterLink,
    PasswordModule,
    DividerModule,
    InputMaskModule,
    DropdownModule,
    ButtonModule,
    CheckboxModule,
    CalendarModule
  ],
  template: `
    <div class="flex flex-1 align-items-center justify-content-center flex-column w-90rem m-auto min-h-full px-4 fadeinleft animation-duration-500">
      <div class="bg-white flex flex-1 flex-column align-items-center w-full max-w-62rem my-5 p-3 sm:p-5">
        <header class="flex flex-column text-center gap-1">
          <i class="pi pi-user-plus text-5xl font-bold text-red-600"></i>
          <h1 class="text-3xl">Criar uma conta</h1>
        </header>

        <div class="flex-1 flex align-items-center justify-content-center w-full pt-6 pb-8 px-0">
          <form [formGroup]="form" class="w-full" (ngSubmit)="onSubmit(form)">
            <section class="grid formgrid p-fluid m-0">
              <div class="field col-12 mb-4 flex flex-wrap">
                <label for="email" htmlFor="email" class="font-medium text-900"
                  >Email
                  <small
                    id="email-help"
                    [ngClass]="
                      form.get('email')?.invalid
                        ? 'text-red-500'
                        : 'text-green-500'
                    "
                  >
                    *
                  </small>
                </label>
                <div class="p-input-icon-left ">
                  <i class="pi pi-at"></i>
                  <input
                    pInputText
                    id="email"
                    class="p-inputtext p-component p-element"
                    formControlName="email"
                  />
                </div>
                <small class="text-xs"
                  >O endereço de e-mail é usado para acessar a sua conta.</small
                >
              </div>

              <div class="col-12 field mb-4 flex flex-wrap">
                <label
                  for="password"
                  htmlFor="password"
                  class="font-medium h-0 text-900"
                  >Senha
                  <small
                    id="passoword"
                    [ngClass]="
                      form.get('password')?.invalid
                        ? 'text-red-500'
                        : 'text-green-500'
                    "
                  >
                    *
                  </small>
                </label>

                <p-password
                  id="password"
                  aria-describedby="password"
                  formControlName="password"
                  [style]="{ width: '100%' }"
                  class="w-full z-1"
                  placeholder="Digite sua senha"
                  inputStyleClass="w-full z-1"
                  promptLabel="Digite a senha"
                  weakLabel="Fraca"
                  mediumLabel="Média"
                  strongLabel="Forte"
                  styleClass="z-1"
                  [toggleMask]="true"
                >
                  <ng-template pTemplate="header">
                    <h6>Qualidade da senha</h6>
                  </ng-template>
                  <ng-template pTemplate="footer">
                    <p-divider></p-divider>
                    <p class="mt-2">Sugestões</p>
                    <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                      <li>Pelo menos uma minúscula</li>
                      <li>Pelo menos uma maiúscula</li>
                      <li>Ao menos um número</li>
                      <li>Mínimo de 8 caracteres</li>
                    </ul>
                  </ng-template>
                </p-password>
              </div>

              <p-divider class="col-12" />

              <div class="field col-12 mb-4 flex flex-wrap">
                <label
                  for="username"
                  htmlFor="username"
                  class="font-medium text-900"
                  >Nome completo
                  <small
                    id="username-help"
                    [ngClass]="
                      form.get('username')?.invalid
                        ? 'text-red-500'
                        : 'text-green-500'
                    "
                  >
                    *
                  </small>
                </label>
                <div class="p-input-icon-left">
                  <i class="pi pi-bookmark"></i>
                  <input
                    pInputText
                    id="username"
                    class="p-inputtext p-component p-element"
                    formControlName="username"
                  />
                </div>
              </div>

              <p-divider class="col-12" />

              <div class="field col-12 sm:col-3 mb-4 flex flex-wrap">
                <label for="cpf" htmlFor="cpf" class="font-medium text-900"
                  >CPF
                  <small
                    id="cpf-help"
                    [ngClass]="
                      form.get('cpf')?.invalid
                        ? 'text-red-500'
                        : 'text-green-500'
                    "
                  >
                    *
                  </small>
                </label>
                <div class="p-input-icon-right">
                  <i class="pi pi-shield"></i>
                  <input
                    pInputText
                    type="text"
                    id="cpf_input"
                    formControlName="cpf"
                  />
                </div>
              </div>

              <div class="field col-12 sm:col-3 mb-4 flex flex-wrap">
                <label for="rg" htmlFor="rg" class="font-medium text-900"
                  >RG
                  <small
                    id="rg-help"
                    [ngClass]="
                      form.get('rg')?.invalid
                        ? 'text-red-500'
                        : 'text-green-500'
                    "
                  >
                    *
                  </small>
                </label>
                <div class="p-input-icon-right">
                  <i class="pi pi-shield"></i>
                  <input
                    pInputText
                    type="text"
                    id="rg_input"
                    formControlName="rg"
                  />
                </div>
              </div>

              <div class="field col-12 sm:col-3 mb-4 flex flex-wrap">
                <label
                  for="maritalStatus"
                  htmlFor="maritalStatus"
                  class="font-medium text-900"
                  >Estado civil
                  <small
                    id="maritalStatus-help"
                    [ngClass]="
                      form.get('maritalStatus')?.invalid
                        ? 'text-red-500'
                        : 'text-green-500'
                    "
                  >
                    *
                  </small>
                </label>
                <div class="p-input-icon-right">
                  <p-dropdown
                    [options]="maritalStatus"
                    formControlName="maritalStatus"
                    placeholder="Selecione o estado civil"
                    optionLabel="name"
                  />
                </div>
              </div>

              <div class="field col-12 sm:col-3 mb-4 flex flex-wrap">
                <label
                  for="phoneFixed"
                  htmlFor="phoneFixed"
                  class="font-medium text-900"
                  >Telefone Fíxo
                  <small
                    id="phoneFixed-help"
                    [ngClass]="
                      form.get('phoneFixed')?.invalid
                        ? 'text-red-500'
                        : 'text-green-500'
                    "
                  >
                    *
                  </small>
                </label>
                <div class="p-input-icon-right">
                  <i class="pi pi-phone"></i>
                  <input
                    pInputText
                    id="phoneFixed_input"
                    formControlName="phoneFixed"
                  />
                </div>
              </div>

              <div class="field col-12 sm:col-3 mb-4 flex flex-wrap">
                <label for="phone" htmlFor="phone" class="font-medium text-900"
                  >Celular
                  <small
                    id="phone-help"
                    [ngClass]="
                      form.get('phone')?.invalid
                        ? 'text-red-500'
                        : 'text-green-500'
                    "
                  >
                    *
                  </small>
                </label>
                <div class="p-input-icon-right">
                  <i class="pi pi-phone"></i>
                  <input pInputText id="phone_input" formControlName="phone" />
                </div>
              </div>

              <div class="field col-12 md:col-3 mb-4">
                <label
                  for="birthDate"
                  htmlFor="birthDate"
                  class="font-medium text-900"
                  >Nascimento
                  <small
                    id="birthDate-help"
                    [ngClass]="
                      form.get('birthDate')?.invalid
                        ? 'text-red-500'
                        : 'text-green-500'
                    "
                  >
                    *
                  </small>
                </label>
                <div>
                  <p-calendar
                    formControlName="birthDate"
                    [showIcon]="true"
                    dateFormat="dd/mm/yy"
                    [readonlyInput]="true"
                    [maxDate]="currentDate"
                  />
                </div>
              </div>

              <div class="field col-12 sm:col-3 mb-4 flex flex-wrap">
                <label for="sex" htmlFor="sex" class="font-medium text-900">
                  Sexo
                  <small [ngClass]="form.get('sex')?.invalid ? 'text-red-500' : 'text-green-500'">*</small>
                </label>
                <div class="p-input-icon-right">
                  <p-dropdown
                    [options]="sex"
                    formControlName="sex"
                    placeholder="Selecione o sexo"
                    optionLabel="name"
                  />
                </div>
              </div>

              <p-divider class="col-12" />

              <div class="field col-12 sm:col-3 mb-4 flex flex-wrap">
                <label for="cep" htmlFor="cep" class="font-medium text-900"
                  >CEP
                  <small
                    id="phone-help"
                    [ngClass]="
                      form.get('cep')?.invalid
                        ? 'text-red-500'
                        : 'text-green-500'
                    "
                  >
                    *
                  </small>
                </label>
                <div class="p-input-icon-right">
                  <i class="pi pi-globe"></i>
                  <p-inputMask
                    (onComplete)="getCEPValue()"
                    mask="99999-999"
                    formControlName="cep"
                    id="ssn_input"
                  />
                </div>
              </div>

              <div class="field col-6 sm:col-3 mb-4 flex flex-wrap">
                <label for="cep" htmlFor="city" class="font-medium text-900"
                  >Cidade
                </label>
                <div class="p-input-icon-right">
                  <i class="pi pi-map-marker"></i>
                  <input
                    pInputText
                    id="city"
                    readonly="readonly"
                    class="p-inputtext p-component p-element"
                    formControlName="city"
                  />
                </div>
              </div>

              <div class="field col-6 sm:col-2 mb-4 flex flex-wrap">
                <label
                  for="country"
                  htmlFor="country"
                  class="font-medium text-900"
                >
                  Estado
                </label>
                <div class="p-input-icon-right">
                  <i class="pi pi-map-marker"></i>
                  <input
                    id="country"
                    readonly="readonly"
                    type="text"
                    pInputText
                    class="p-inputtext p-component p-element"
                    formControlName="country"
                  />
                </div>
              </div>

              <div class="field col-12 sm:col-4 mb-4 flex flex-wrap">
                <label
                  for="birthCity"
                  htmlFor="birthCity"
                  class="font-medium text-900"
                  >Naturalidade
                  <small
                    id="birthCity-help"
                    [ngClass]="
                      form.get('birthCity')?.invalid
                        ? 'text-red-500'
                        : 'text-green-500'
                    "
                  >
                    *
                  </small>
                </label>
                <div class="p-input-icon-right">
                  <i class="pi pi-map-marker"></i>
                  <input
                    pInputText
                    id="birthCity"
                    class="p-inputtext p-component p-element"
                    formControlName="birthCity"
                  />
                </div>
              </div>

              <div class="field col-12 mb-4 flex flex-wrap">
                <label
                  for="address"
                  htmlFor="address"
                  class="font-medium text-900"
                  >Endereço
                  <small
                    id="address-help"
                    [ngClass]="
                      form.get('address')?.invalid
                        ? 'text-red-500'
                        : 'text-green-500'
                    "
                  >
                    *
                  </small>
                </label>
                <div class="p-input-icon-left ">
                  <i class="pi pi-map"></i>
                  <input
                    pInputText
                    id="address"
                    class="p-inputtext p-component p-element"
                    formControlName="address"
                  />
                </div>
              </div>

              <div class="field col-6 sm:col-4 mb-4 flex flex-wrap">
                <label
                  for="houseNumber"
                  htmlFor="houseNumber"
                  class="font-medium text-900"
                  >Número
                  <small
                    id="houseNumber-help"
                    [ngClass]="
                      form.get('houseNumber')?.invalid
                        ? 'text-red-500'
                        : 'text-green-500'
                    "
                  >
                    *
                  </small>
                </label>
                <div class="p-input-icon-left ">
                  <i class="pi pi-map"></i>

                  <input
                    pInputText
                    id="houseNumber"
                    class="p-inputtext p-component p-element"
                    formControlName="houseNumber"
                  />
                </div>
              </div>

              <div class="field col-6 sm:col-4 mb-4 flex flex-wrap">
                <label
                  for="complement"
                  htmlFor="district"
                  class="font-medium text-900"
                >
                  Complemento
                </label>
                <div class="p-input-icon-left ">
                  <i class="pi pi-map"></i>

                  <input
                    pInputText
                    id="complement"
                    class="p-inputtext p-component p-element"
                    formControlName="complement"
                  />
                </div>
              </div>

              <div class="field col-12 sm:col-4 mb-4 flex flex-wrap">
                <label
                  for="district"
                  htmlFor="district"
                  class="font-medium text-900"
                  >Bairro
                  <small
                    id="district-help"
                    [ngClass]="
                      form.get('district')?.invalid
                        ? 'text-red-500'
                        : 'text-green-500'
                    "
                  >
                    *
                  </small>
                </label>
                <div class="p-input-icon-left ">
                  <i class="pi pi-map"></i>

                  <input
                    pInputText
                    id="district"
                    class="p-inputtext p-component p-element"
                    formControlName="district"
                  />
                </div>
              </div>

              <p-divider class="col-12" />
              
            </section>

            <p-divider class="col-12" />

                        <footer class="grid mx-0 mt-4">
              <div class="col-12 flex justify-content-center">
                <p-button
                  [disabled]="!form.valid || form.pending"
                  [loading]="isLoading()"
                  type="submit"
                  label="Criar seu Cadastro"
                  styleClass="font-bold"
                />
              </div>
            </footer>
          </form>
        </div>
      </div>
    </div>
  `
})
export class RegisterPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private store = inject(Store);
  private registerService = inject(RegisterService);
  private injector = inject(Injector);

  registerFields: WritableSignal<RegisterType> = signal<RegisterType>(new RegisterType());
  isLoading = signal<boolean>(false);

  weakExpression = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
  form: FormGroup;
  sex: DropType[] = [
    { name: 'Masculino', code: 'masculino' },
    { name: 'Feminino', code: 'feminino' }
  ];
  maritalStatus: DropType[] = [
    { name: 'Casado', code: 'casado' },
    { name: 'Solteiro', code: 'solteiro' },
    { name: 'Divorciado', code: 'divorciado' },
    { name: 'União estável', code: 'uniaoStavel' }
  ];
  currentDate = new Date();

  ngOnInit(): void {
    this.configFormValues();
    this.setIbgeInformationsOnFields();
  }

  configFormValues(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.emailDomainValidator]],
      password: ['', Validators.required, this.customPasswordValidatorAsync.bind(this)],
      username: ['', Validators.required],
      maritalStatus: [this.maritalStatus[0], Validators.required],
      cpf: ['', Validators.required, CPFGenericValidator.isValidCpfAsync()],
      rg: ['', Validators.required],
      birthDate: ['', Validators.required],
      phone: ['', Validators.required],
      phoneFixed: [''],
      cep: ['', Validators.required],
      sex: [this.sex[0], Validators.required],
      city: [{ value: '', disabled: true }],
      country: [{ value: '', disabled: true }],
      address: ['', Validators.required],
      birthCity: ['', Validators.required],
      houseNumber: ['', Validators.required],
      district: ['', Validators.required],
      complement: [''],
      newsReceive: [false]
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

  customPasswordValidatorAsync(control: AbstractControl): Promise<{ [key: string]: boolean } | null> {
    return Promise.resolve(this.customPasswordValidator(control));
  }

  customPasswordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.value;
    const regex = this.weakExpression;
    return !regex.test(password) ? { invalidPassword: true } : null;
  }

  setIbgeInformationsOnFields(): void {
    this.store.select(ibgeInformationSelector).subscribe({
      next: (ibgeRes: IbgeInterfaceModel) => {
        if (ibgeRes) {
          this.form.patchValue({
            city: ibgeRes.localidade,
            country: ibgeRes.uf
          });
          this.form.get('city')?.enable();
          this.form.get('country')?.enable();
        } else {
          this.form.get('city')?.setValue('');
          this.form.get('country')?.setValue('');
        }
      }
    });
  }

  getCEPValue(): void {
    const cepValue = this.form.get('cep')?.value;
    this.store.dispatch(IbgeInformationActions.selectIbgeInfor({ value: cepValue }));
  }

  handleRegisterValues(): void {
    effect(() => {
      if (this.registerFields() && this.registerFields() !== new RegisterType()) {
        this.registerService.registerUser(this.registerFields()).subscribe({
          next: register => {
            if (register) this.registerSuccess();
          },
          error: (err: HttpErrorResponse) => this.registerError(err)
        });
      }
    }, { injector: this.injector });
  }

  registerError(err: HttpErrorResponse): void {
    if (err.status === 400) {
      this.isLoading.update(() => false);
      this.form.get('email')?.setErrors({ customError: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.store.dispatch(MessageAction.sendMessage({
        message: { severity: 'Error', detail: err.error.message }
      }));
    }
  }

  registerSuccess(): void {
    this.isLoading.update(() => false);
    this.store.dispatch(MessageAction.sendMessage({
      message: { severity: 'Success', detail: 'Usuário registrado com sucesso' }
    }));
    this.router.navigate(['/login']);
  }

  formatDateToString(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd HH:mm:ss', 'en-US');
  }

  mountRegisterValues(registerMemberProps: FormGroup): RegisterType {
    const registerValue = registerMemberProps.value;
    
    return {
      nome: registerValue.username,
      status: 1,
      email: registerValue.email,
      sexo: registerValue.sex?.name || '',
      cpf: registerValue.cpf,
      rg: registerValue.rg,
      estadoCivil: registerValue.maritalStatus?.name || '',
      naturalidade: registerValue.birthCity,
      telefoneFixo: registerValue.phoneFixed,
      dataNascimento: this.formatDateToString(registerValue.birthDate),
      celular: registerValue.phone,
      receberEmail: registerValue.newsReceive,
      cep: registerValue.cep,
      logradouro: registerValue.address,
      numero: registerValue.houseNumber,
      estado: registerValue.country,
      bairro: registerValue.district,
      cidade: registerValue.city,
      senha: registerValue.password
    };
  }

  onSubmit(createMemberProps: FormGroup): void {
    console.log('Form Status:', this.form.status);
    console.log('Form Errors:', this.form.errors);
    
    if (this.form.valid) {
      const registerMemberDetails = this.mountRegisterValues(createMemberProps);
      this.isLoading.update(() => true);
      this.registerFields.update(() => registerMemberDetails);
      this.handleRegisterValues();
    } else {
      console.error('Formulário inválido. Campos com erro:');
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.invalid) {
          console.error(`Campo ${key}:`, control.errors);
        }
      });
    }
  }
}
