import { CommonModule, TitleCasePipe } from '@angular/common';
import { inject, Component, OnInit } from '@angular/core';
import { userDetailsNameSelect } from '@shared/store/reducers/user-details.reducer';
import { LoginActions } from '@shared/store/actions/auth.actions';

import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Store } from '@ngrx/store';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';

import { Constants } from '../../utils/constants/index';

import { Router } from '@angular/router';

@Component({
  selector: 'app-student-portal-button',
  standalone: true,
  imports: [
    ButtonModule,
    SplitButtonModule,
    OverlayPanelModule,
    TitleCasePipe,
    CommonModule,
    AvatarModule,
    AvatarGroupModule
  ],
  
template: `
  <ng-container *ngIf="!userName; then noHasUser; else hasUser"></ng-container>

  <ng-template #noHasUser>
    <div id="button_box" style="display: flex; gap: 10px; text-wrap: nowrap;">
      <p-button
        id="class_button"
        label="Área do Aluno"
        (onClick)="goToLogin()"
        styleClass="border-round-2xl p-button"
      ></p-button>

      <p-button
        id="simulados_button"
        label="Simulados"
        (onClick)="goToSimulados()"
        styleClass="border-round-2xl p-button"
      ></p-button>
    </div>
  </ng-template>

  <ng-template #hasUser>
    <div>
      <p-button
        iconPos="right"
        [label]="'Olá, ' + firstName | titlecase"
        icon="pi pi-chevron-down"
        [text]="true"
        (click)="menu.toggle($event)"
      ></p-button>
      <p-tieredMenu #menu [model]="items" [popup]="true"></p-tieredMenu>
    </div>
  </ng-template>
`
})
export class StudentPortalButtonComponent implements OnInit {
  userName: string | null = '';
  firstName = '';
  items = [
    {
      label: 'Portal do Auno',
      icon: 'pi pi-home',
      command: () => {
        this.goToPortal();
      }
    },
    {
      label: 'Meu Perfil',
      icon: 'pi pi-user',
      command: () => {
        this.goToPerfil();
      }
    },
    {
      label: 'Meus cursos',
      icon: 'pi pi-folder',
      command: () => {
        this.goToCursos();
      }
    },
    {
      label: 'Meus pedidos',
      icon: 'pi pi-shopping-cart',
      command: () => {
        this.goToPedidos();
      }
    },
    {
     label: 'Certificados',
     icon: 'pi pi-file',
     command: () => {
       this.goToCertificado();
     }
   },
    {
      label: 'Simulados',
      icon: 'pi pi-question',
      command: () => {
        this.goToSimulados();
      }
    },
    { separator: true },
    {
      label: 'Sair',
      icon: 'pi pi-user-minus',
      command: () => {
        this.handleLogout();
      }
    }
  ];

  private store = inject(Store);
  private router = inject(Router);
  
  ngOnInit(): void {
    this.getUserName();
  }

  getUserName(): void {
    this.store.select(userDetailsNameSelect).subscribe({
      next: userName => {
        if (userName) {
          this.userName = userName;
          const splitName = userName.split(' ');
          this.firstName = splitName[0];
        } else this.userName = null;
      }
    });
  }

  goToLogin(): void {
    const hostname = window.location.origin;
    let url = `${hostname}/login`;

    window.open(url, '_parent');
  }

    goToSimulados() {
    window.location.href = 'https://ecocursos.com.br/simulados';
  }
  
  goToPortal(): void {
    let url = Constants.portalLink;

    if(localStorage.getItem('token') != null) {
      url = url + "?token=" + localStorage.getItem('token')?.toString();
    }

    window.open(url, '_parent');
  }
  
  goToCursos(): void {
    let url = "https://login.ecocursos.com.br/portal/aluno/meus-cursos";

    if(localStorage.getItem('token') != null) {
      url = url + "?token=" + localStorage.getItem('token')?.toString();
    }

    window.open(url, '_parent');
  }
  
  goToPedidos(): void {
    let url = "https://login.ecocursos.com.br/portal/aluno/meus-pedidos";

    if(localStorage.getItem('token') != null) {
      url = url + "?token=" + localStorage.getItem('token')?.toString();
    }

    window.open(url, '_parent');
  }
  
  goToPerfil(): void {
    let url = "https://login.ecocursos.com.br/portal/aluno/meus-dados";
    
    if(localStorage.getItem('token') != null) {
      url = url + "?token=" + localStorage.getItem('token')?.toString();
    }
  
    window.location.href = url; // Usar href em vez de open
  }
  
  goToCertificado(): void {
    let url = "https://login.ecocursos.com.br/portal/aluno/certificados";

    if(localStorage.getItem('token') != null) {
      url = url + "?token=" + localStorage.getItem('token')?.toString();
    }

    window.open(url, '_parent');
  }

  handleLogout(): void {
    this.store.dispatch(LoginActions.logout());
  }
}
