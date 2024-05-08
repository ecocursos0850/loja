import { AfterContentInit, Component, inject, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { CreateSimulateRequireProps } from '@shared/models/interface/simulate.interface';
import { CategoriesType } from '@shared/models/interface/categories.interface';
import { CategoriesActions } from '@shared/store/actions/categories.actions';
import { simulatedFromCategoriessSelectoCollection } from '@shared/store/reducers/simulatedFromCategories.reducer';
import { categoriesSelector } from '@shared/store/reducers/categories.reducer';
import { CreateSimulatedActions } from '@shared/store/actions/simulated.actions';
import { SimulatedFromCategoriesType } from '@shared/models/interface/simulated-from-categories.interface';
import { CardNavigationActions } from '@shared/store/actions/card-navigation.actions';

import { select, Store } from '@ngrx/store';
import { SharedModule } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    ButtonModule,
    DropdownModule,
    NgIf,
    ReactiveFormsModule,
    SharedModule
  ],
  template: `
    <div
      class="flex grid m-0 px-3 md:px-0 justify-content-center align-itens-center row gap-3"
    >
      <div class="col-12 md:col-5 sm:col-12 card text-center shadow-1">
        <header class="py-3">
          <h1 class="text-xl sm:text-2xl font-normal">Selecione um simulado</h1>
        </header>

        <form
          class="w-full col-12"
          [formGroup]="formGroup"
          (ngSubmit)="onSubmit(formGroup)"
        >
          <div class="w-full text-left gap-2 flex flex-column">
            <label class="text-sm sm:text-base font-bold">Categorias</label>
            <p-dropdown
              [options]="categories"
              class="w-full"
              styleClass="w-full text-left"
              [filter]="true"
              (onShow)="getAllCetegoriesFromApi()"
              placeholder="Escolha uma categoria"
              formControlName="category"
              (onChange)="handleFieldEvent($event.value)"
              optionLabel="descricao"
              [showClear]="true"
            >
              <ng-template class="w-full" let-category pTemplate="item">
                <div
                  (click)="sendIdToCategories(category.id)"
                  class="flex align-items-center w-full gap-1"
                >
                  <div>{{ category.descricao }}</div>
                </div>
              </ng-template>
            </p-dropdown>
          </div>

          <div class="-full text-left gap-2 flex flex-column mt-4">
            <label class="text-sm sm:text-base font-bold">Simulados</label>
            <p-dropdown
              [options]="simulatedFromCategory"
              formControlName="simulated"
              class="w-full"
              styleClass="w-full text-left"
              [filter]="true"
              placeholder="Selecione uma área"
              optionLabel="categoriaSimulado.descricao"
              (onChange)="handleSimulatedEvent($event.value)"
              [showClear]="true"
            >
              <ng-template class="w-full z-0" let-simulated pTemplate="item">
                <div
                  (click)="getSimulatedId(simulated.id)"
                  class="flex align-items-center w-full gap-2"
                >
                  <div>{{ simulated.categoriaSimulado.descricao }}</div>
                </div>
              </ng-template>
            </p-dropdown>
          </div>

          <div
            class="col-12 flex mt-2 justify-content-center sm:justify-content-end"
          >
            <p-button
              styleClass="text-sm sm:text-base"
              (onClick)="navigateToQuestionary()"
              label="Gerar Simulado"
              type="submit"
              [disabled]="!formGroup.valid"
            />
          </div>
        </form>
      </div>
      <div class="col-12 md:col-5 sm:col-12 card text-center shadow-1">
        <header class="py-3">
          <h1 class="text-xl sm:text-2xl font-normal">
            Ajuda <label class="text-900 font-bold">ECO</label
            ><label class="text-red-600 font-bold">CURSOS</label>
          </h1>
        </header>

        <div class="text-left line-height-4 px-2 sm:px-4">
          <p class="text-sm sm:text-base text-900">
            Os simulados <label class="text-900 font-bold">ECO</label>
            <label class="text-red-600 font-bold">CURSOS</label> são gratuitos.
          </p>
          <p class="text-sm sm:text-base text-900">
            <strong>Não</strong> é necessário possuir cadastro no site.
          </p>
          <p class="text-sm sm:text-base text-900">
            Serão retornadas <strong>10</strong> questões.
          </p>
          <p class="text-sm sm:text-base text-900">
            Cada questão vale <strong>1 (um)</strong> ponto.
          </p>
          <p class="text-sm sm:text-base text-900">
            Faça os simulados quantas vezes quiser.
          </p>
          <p class="font-bold text-green-600 text-center sm:text-left">
            Boa Sorte!
          </p>
        </div>
      </div>
    </div>
  `
})
export class CategoriesChoiceComponent implements OnInit, AfterContentInit {
  private fb = inject(FormBuilder);
  private store = inject(Store<CreateSimulateRequireProps>);
  private router = inject(Router);

  pageName = 'Simulados';
  formGroup: FormGroup;
  categories: CategoriesType[];
  simulatedFromCategory: SimulatedFromCategoriesType[];
  categoryId: string | number;
  selectedSimuladoId: string | number;

  ngOnInit(): void {
    this.configFormValues();

    this.store.dispatch(CategoriesActions.enter());
  }

  ngAfterContentInit(): void {
    this.store.dispatch(CardNavigationActions.enter());
    this.store.dispatch(
      CardNavigationActions.selectPage({ page: this.pageName })
    );
  }

  navigateToQuestionary(): void {
    const queryParams = {
      category: this.categoryId,
      simulatedSelected: this.selectedSimuladoId
    };
    this.router.navigate(['simulados', 'questionario'], { queryParams });
  }

  getSimulatedId(id: number | string): void {
    this.selectedSimuladoId = id;
  }

  handleSimulatedEvent(event: SimulatedFromCategoriesType): void {
    this.getSimulatedId(event.id);
  }

  sendIdToCategories(idValue: string | number): void {
    this.store.dispatch(CategoriesActions.selectCategory({ id: idValue }));

    this.store
      .pipe(select(simulatedFromCategoriessSelectoCollection))
      .subscribe({
        next: res => (this.simulatedFromCategory = res)
      });
  }

  getAllCetegoriesFromApi(): void {
    this.store.pipe(select(categoriesSelector)).subscribe({
      next: res => (this.categories = res.collection)
    });
  }

  configFormValues(): void {
    this.formGroup = this.fb.group({
      category: ['', Validators.required],
      simulated: [{ value: null, disabled: true }, Validators.required]
    });
  }

  handleFieldEvent(event: CategoriesType): void {
    this.categoryId = event.id;
    this.sendIdToCategories(event.id);
    this.disabledSimulatedField();
  }

  disabledSimulatedField(): void {
    const fieldCategory = this.formGroup.get('category');
    const fieldSimulated = this.formGroup.get('simulated');

    if (fieldCategory && fieldSimulated) {
      if (fieldCategory.invalid || !fieldSimulated.disabled) {
        fieldSimulated.disable();
        this.formGroup.reset();
      } else {
        fieldSimulated.enable();
      }
    }
  }

  onSubmit(simulatedProps: FormGroup): void {
    const simulateValue = simulatedProps.value;
    const simulatedFormValue = {
      category: simulateValue.category.name,
      simulated: simulateValue.simulated.name
    };

    this.store.dispatch(
      CreateSimulatedActions.createSimulate({
        simulate: simulatedFormValue
      })
    );
  }
}
