import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import {
  CarouselBannerComponent,
  Slide
} from '@shared/components/CarouselBanner';
import { ObjectiveCardType } from '@shared/models/interface/objective-card.interface';
import { ObjectiveCardDataService } from '@shared/services/objectives-card.service';
import { Constants } from '@shared/utils/constants';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TimelineModule } from 'primeng/timeline';
import { CarouselModule } from 'primeng/carousel';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';

import { InforCardComponent } from '../../components/InforCard';
import { NewlasterComponent } from '../../components/Newlaster';
import { BannerService } from '@shared/services/banner.service';
export interface ResponsiveOptions {
  breakpoint: string;
  numVisible: number;
  numScroll: number;
}

interface EventItem {
  status: string;
  icon: string;
  color: string;
  description: string;
  iconColor: string;
}
@Component({
  selector: 'page-landing-page',
  standalone: true,
  imports: [
    FormsModule,
    CardModule,
    NgForOf,
    NgIf,
    ButtonModule,
    TimelineModule,
    CarouselModule,
    InputTextModule,
    AccordionModule,
    NewlasterComponent,
    InforCardComponent,
    CarouselBannerComponent
  ],
  template: `
    <div class="mb-10">
      <section>
        <app-carousel-banner
          [playTime]="6000"
          [slides]="slides"
          [controls]="true"
        />
        <app-infor-card
          AnimateOnScroll
          enterClass="fadeinleft"
          leaveClass="fadeoutleft"
        />
        <div class="bg-white pt-4">
          <div
            class="w-90rem w-full flex m-auto align-items-center justify-content-between
            grid fadeinright animation-duration-1000 gap-2"
          >
            <div class="col-12 md:col-5">
              <img
                style="width:90%"
                src="assets/images/banner-img.png"
                alt="Thumb"
              />
            </div>

            <div
              pAnimateOnScroll
              enterClass="fadeinleft"
              leaveClass="fadeoutleft"
              class="col-12 text-center sm:text-left md:col-6 sm:col-11"
            >
              <div class="mb-6">
                <h1 class="text-4xl">Você já escolheu o curso?</h1>
              </div>
              <p-timeline
                [value]="events"
                layout="vertical"
                styleClass="customized-timeline pl-3 sm:p-0"
              >
                <ng-template pTemplate="marker" let-event>
                  <span
                    class="custom-marker p-3 border-round-md shadow-2 rotate-45 "
                    [style.backgroundColor]="event.color"
                    [ngClass]="event.iconColor"
                  >
                    <i class="-rotate-45" [ngClass]="event.icon"></i>
                  </span>
                </ng-template>
                <ng-template pTemplate="content" styleClass="mt-10" let-event>
                  <p-card
                    styleClass="mb-5 bg-transparent shadow-none w-full"
                    [header]="event.status"
                  >
                    <p class="line-height-4">{{ event.description }}</p>
                  </p-card>
                </ng-template>
              </p-timeline>
              <div class="col-12 " style="display: none !important">
                <p-button
                  iconPos="right"
                  label="Fale com nossos consultores"
                  icon="pi pi-chevron-right"
                  (onClick)="goToSalesRep()"
                />
              </div>
            </div>
          </div>
          <div class="w-90rem m-auto mt-4">
            <p-carousel
              [value]="objectives"
              [numVisible]="3"
              [numScroll]="3"
              [circular]="true"
              [autoplayInterval]="5000"
              [responsiveOptions]="responsiveOptions"
            >
              <ng-template let-product pTemplate="item">
                <div
                  class="border-1 surface-border border-round m-2 text-center py-5 px-3"
                >
                  <div class="mb-3">
                    <i
                      class="p-4 shadow-3 pi text-white text-2xl shadow-2 border-round-2xl {{
                        product.icon
                      }} {{ product.iconColor }}"
                    ></i>
                  </div>
                  <div
                    class="flex flex-column justify-content-between text-over"
                  >
                    <h4 class="mb-4 mt-2 text-red-700 font-bold text-xl">
                      {{ product.name }}
                    </h4>
                    <span
                      *ngIf="product.description"
                      style=""
                      class="text-over text-600 line-height-4"
                      >{{ product.description }}</span
                    >
                  </div>
                </div>
              </ng-template>
            </p-carousel>
          </div>
          <div class="p-4 mt-4 bg-red-600 w-full">
            <h1
              class="md:text-4xl lg:text-5xl text-center font-bold text-gray-50"
            >
              Perguntas Frequentes
            </h1>
          </div>
        </div>
        <div
          class="shape-background"
          [ngStyle]="{ backgroundImage: 'url(' + shape + ')' }"
        >
          <div class="py-4 max-w-62rem m-auto z-5">
            <p-accordion styleClass="mb-4" [activeIndex]="0">
              <p-accordionTab
                header="Como funciona o curso?"
                headerStyleClass="bg-white"
              >
                <p class="text-600 line-height-4">
                  Oferecemos cursos de Ensino a Distância (EAD) no Portal
                  ECOCURSOS, com alta interatividade. A inscrição envolve
                  pré-cadastro e confirmação após pagamento. Com e-mail e senha,
                  os alunos acessam o material de estudo e são orientados por
                  tutores especializados. O portal possui recursos para
                  aprendizagem a distância e avaliações online. Com 60% de
                  aproveitamento, o aluno ganha um certificado digital. As
                  provas têm prazos definidos pela carga horária, sendo
                  disponíveis até 90 dias após liberação, salvo solicitação por
                  e-mail. As correções são instantâneas e, em caso de dúvidas,
                  contate a equipe E-LEARNING do ECOCURSOS.
                </p>
              </p-accordionTab>
            </p-accordion>
            <p-accordion styleClass="mb-4">
              <p-accordionTab
                header="Os certificados são reconhecidos pelo MEC?"
                headerStyleClass="bg-white"
              >
                <p class="text-600 line-height-4">
                Os certificados do Portal <strong><span style="color: black;">ECO</span><span style="color: red;">CURSOS</span></strong>
                de cursos livres são reconhecidos em todo território nacional para atualização, aperfeiçoamento,
                capacitação profissional e atividades extracurriculares, conforme a <strong>Lei de Diretrizes e Bases - LDB
                Lei 9394/96, Art. 40; CNE/CNB Nº 06/2012, Art. 25; Decreto Presidencial 5154/2004, Artigo 3º e § 2º.</strong>
                Portanto, não precisam de reconhecimento do MEC para cursos livres. Nos cursos de Graduação e Pós-graduação,
                os certificados possuem reconhecimento do MEC, uma vez que são emitidos por renomadas Universidades parceiras.
                </p>
              </p-accordionTab>
            </p-accordion>
            <p-accordion styleClass="mb-4">
              <p-accordionTab
                header="Os cursos possuem materiais para acompanhamento das aulas?"
                headerStyleClass="bg-white"
              >
                <p class="text-600 line-height-4">
                  Sim. O objetivo do ECOCURSOS é proporcionar um ambiente onde
                  os alunos possam ser certificados pela auto-aprendizagem e
                  acompanhamento de um tutor específico no curso ao qual se
                  inscreveu. Oferecemos materiais de apoio como vídeo aulas e
                  materiais didáticos que estão disponíveis na sua Rede
                  Educacional.
                </p>
              </p-accordionTab>
            </p-accordion>
          </div>
        </div>
      </section>
    </div>
    <div class="max-w-62rem -pt-12 m-auto relative">
      <app-newlaster class="absolute px-2" />
    </div>
  `,
  styles: [
    `
      .animition-type-selector {
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        align-content: center;
        justify-content: center;
        color: white;
        padding-top: 1em;
      }

      .title {
        //background: rgba(0,0,0,0.5);
        user-select: none;
      }
      .button {
        background: #3f51b5;
        cursor: pointer;
        border-radius: 0.3em;
      }
      .title,
      .button {
        height: 2.5em;
        min-width: 4.5em;

        margin-bottom: 1em;
        display: flex;
        align-items: center;
        justify-content: center;

        padding: 0.5em 0.7em;
        transition: background 20ms cubic-bezier(0.25, 0.46, 0.45, 0.84);

        &:not(:last-child) {
          margin-right: 1em;
        }
      }
      .button:hover,
      .active {
        background: #2196f3;
      }

      .-pt-12 {
        top: -12rem;
      }

      :host ::ng-deep .p-timeline-event-opposite {
        display: none;
      }

      :host ::ng-deep .p-card .p-card-body {
        padding: 0;
      }

      :host ::ng-deep .p-card-title {
        color: var(--gray-900);
      }

      :host ::ng-deep .p-timeline-event-content {
        margin-top: 0.5rem;
      }

      .shape-background {
        background-size: 35% 35%;
        background-repeat: space;
        background-attachment: fixed;
      }

      .text-over {
        display: block;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `
  ]
})
export class LandingPageComponent implements OnInit {
  private bannerService = inject(BannerService);
  objectives: ObjectiveCardType[];
  shape = '../../../assets/images/shape.svg';
  value: string;


  slides: Slide[] = [];
  events: EventItem[] = Constants.EventsInformationConstants;
  responsiveOptions: ResponsiveOptions[] = [
    {
      breakpoint: '1199px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '991px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  private objectiveCardDataService = inject(ObjectiveCardDataService);

  ngOnInit(): void {
    this.bannerService.getBanners().subscribe(x => this.slides = x);
    this.objectiveCardDataService.getObjectivesCard().then(objectives => {
      this.objectives = objectives;
    });
  }

  goToSalesRep(): void {
    window.open(Constants.SalesRepLink);
  }
}
