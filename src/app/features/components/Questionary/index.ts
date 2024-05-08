import {
  AfterContentInit,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { CommonModule, NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesActions } from '@shared/store/actions/categories.actions';
import { simulatedFromCategoriessSelectoCollection } from '@shared/store/reducers/simulatedFromCategories.reducer';
import { QuestionsType } from '@shared/models/interface/simulated-from-categories.interface';
import { CardNavigationActions } from '@shared/store/actions/card-navigation.actions';

import { RadioButtonModule } from 'primeng/radiobutton';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [
    RadioButtonModule,
    NgForOf,
    ReactiveFormsModule,
    CommonModule,
    NgStyle,
    FormsModule,
    DividerModule,
    ButtonModule,
    NgClass,
    NgIf,
    ProgressSpinnerModule,
    DialogModule
  ],
  template: `
    <div class="card p-5 max-w-62rem m-auto relative shadow-2 mt-6 sm:mt-5">
      <p-dialog
        [(visible)]="modalVisible"
        [modal]="true"
        styleClass="w-10 sm:w-9 mg:w-7 lg:w-5"
      >
        <div
          class="w-full text-center flex flex-column gap-4 align-items-center justify-content-center"
        >
          <span class="text-xl sm:text-2xl">
            {{
              correctPercentage > 0.59
                ? 'Parabéns, você foi aprovado'
                : 'Infelizmente, não foi dessa vez!'
            }}
          </span>
          <i
            [ngClass]="
              correctPercentage > 0.59
                ? 'pi pi-thumbs-up text-green-600'
                : 'pi pi-thumbs-down text-red-600'
            "
            class="text-6xl sm:text-6xl md:text-7xl text-center font-bold "
          ></i>
          <div class="flex wrap mt-2">
            <div>
              <span class="text-xs sm:text-sm">Nº de Questões:</span>
              <p class="font-bold text-3xl sm:text-4xl line-height-4">
                {{ questions?.length }}
              </p>
            </div>
            <p-divider layout="vertical"></p-divider>

            <div>
              <span class="text-xs sm:text-sm">Nº de Acertos:</span>
              <p class="font-bold text-3xl sm:text-4xl line-height-4">
                {{ correctAnswers.size }}
              </p>
            </div>
            <p-divider layout="vertical"></p-divider>
            <div>
              <span class="text-xs sm:text-sm">Total em Porcentagem:</span>
              <p
                [ngClass]="
                  correctPercentage > 0.59 ? 'text-green-600' : 'text-red-600'
                "
                class="font-bold text-3xl sm:text-4xl line-height-4"
              >
                {{ correctPercentage | percent }}
              </p>
            </div>
          </div>
        </div>
        <ng-template pTemplate="footer">
          <p-button
            icon="pi pi-check"
            (click)="modalVisible = false"
            label="Ver Gabarito"
            styleClass="p-button-text"
          />
        </ng-template>
      </p-dialog>

      <header
        class="absolute py-2 font-bold px-4 text-white bg-red-500 border-round-lg header__position"
      >
        <span class="font-bold text-sm sm:text-base">{{
          titleSimulated()
        }}</span>
      </header>

      <p-progressSpinner
        *ngIf="!loaded()"
        styleClass="w-4rem h-4rem w-full h-full flex justify-content-center"
        strokeWidth="8"
        fill="var(--surface-ground)"
        animationDuration=".5s"
      />

      <form
        *ngIf="loaded()"
        class="px-1 sm:px-6 mt-3"
        [formGroup]="form"
        (ngSubmit)="onSubmit(form.value)"
      >
        <div *ngFor="let question of questions; let i = index">
          <label class="line-height-3 text-sm sm:text-base text-800"
            ><b>{{ i + 1 }}. </b> {{ question.descricao }}
          </label>
          <ol class="ml-3 sm:ml-4 mt-3 flex flex-column">
            <li
              id="list__questions"
              *ngFor="let resposta of question.respostas; let j = index"
              [ngClass]="
                showResult
                  ? {
                      'bg-green-100 p-2 border-round-lg shadow-3':
                        resposta.correta,
                      'bg-red-100':
                        !resposta.correta &&
                        form.get('question-' + question.id)?.value ===
                          resposta.id
                    }
                  : ''
              "
              [style.padding]="
                showResult &&
                !resposta.correta &&
                form.get('question-' + question.id)?.value === resposta.id
                  ? '0.5rem'
                  : '0'
              "
              [style.border]="
                showResult &&
                !resposta.correta &&
                form.get('question-' + question.id)?.value === resposta.id
                  ? '1px solid var(--gray-300)'
                  : '0'
              "
              [style.border-radius]="
                showResult &&
                !resposta.correta &&
                form.get('question-' + question.id)?.value === resposta.id
                  ? '0.5rem'
                  : '0'
              "
              [style.box-shadow]="
                showResult &&
                !resposta.correta &&
                form.get('question-' + question.id)?.value === resposta.id
                  ? '0px 1px 8px rgba(0, 0, 0, 0.08), ' +
                    '0px 3px 4px rgba(0, 0, 0, 0.1), ' +
                    '0px 1px 4px -1px rgba(0, 0, 0, 0.1)'
                  : ''
              "
              class="field-checkbox"
            >
              <span> {{ itensQuestion[j] }}. </span>

              <p-radioButton
                [inputId]="resposta.id.toString()"
                [name]="'question-' + question.id"
                [value]="resposta.id"
                formControlName="question-{{ question.id }}"
              />
              <label [for]="resposta.id" class="ml-2 text-sm sm:text-base ">{{
                resposta.resposta
              }}</label>
            </li>
            <p-divider />
          </ol>
        </div>
        <footer class="w-full flex justify-content-center">
          <p-button
            styleClass="text-sm sm:text-base"
            label="Corrigir Simulado"
            type="submit"
          />
        </footer>
      </form>
    </div>
  `,
  styles: [
    `
      .header__position {
        top: -14px;
        left: 42px;
        margin-bottom: 67px !important;
      }
    `
  ]
})
export class QuestionaryComponent implements OnInit, AfterContentInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  pageName = 'Simulados';
  form: FormGroup;
  questions: QuestionsType[] = [];
  modalVisible = false;
  correctAnswers = new Set<number | string>();
  correctPercentage: number;
  showResult: boolean;
  itensQuestion = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

  titleSimulated = signal<string>('');
  loaded = signal<boolean>(false);

  categorieId: string;
  simulatedId: string;

  ngOnInit(): void {
    this.form = this.fb.group({});

    this.route.queryParams.subscribe({
      next: routeParams => {
        this.categorieId = routeParams['category'];
        this.simulatedId = routeParams['simulatedSelected'];
      }
    });

    this.store.dispatch(
      CategoriesActions.selectCategory({ id: this.categorieId })
    );

    this.loadDataFromCategories(this.simulatedId);
  }

  loadDataFromCategories(simulatedId: number | string): void {
    this.store.select(simulatedFromCategoriessSelectoCollection).subscribe({
      next: res => {
        const simulated = res.find(
          value => value.id.toString() === simulatedId
        );
        if (simulated) {
          this.questions = simulated.perguntas;
          this.titleSimulated.set(simulated.titulo);

          this.formConfiguration();
          this.loaded.update(() => true);
        }
      }
    });
  }

  ngAfterContentInit(): void {
    this.store.dispatch(CardNavigationActions.enter());
    this.store.dispatch(
      CardNavigationActions.selectPage({
        page: this.pageName
      })
    );
  }

  formConfiguration(): void {
    this.questions.forEach(question => {
      this.form.addControl(
        `question-${question.id}`,
        new FormControl('', Validators.required)
      );
    });
  }

  checkQuestionsCorrect(eventValue: number | string): void {
    this.questions.map(qt =>
      qt.respostas.filter(rt => {
        if (rt.correta && rt.id === eventValue) {
          this.correctAnswers.add(rt.id);
        }
      })
    );
  }

  onSubmit(eventValue: any): void {
    Object.keys(eventValue).map(key => {
      this.checkQuestionsCorrect(eventValue[key]);
    });

    this.correctPercentage = this.correctAnswers.size / this.questions.length;

    this.questions.forEach(question => {
      this.form.get(`question-${question.id}`)?.disable();
    });

    this.showResult = true;
    this.modalVisible = true;
  }
}
