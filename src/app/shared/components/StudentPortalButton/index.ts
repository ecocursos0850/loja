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
      label: 'Portal do aluno',
      icon: 'pi pi-home',
      command: () => {
        this.goToPortal();
      }
    },
    {
      label: 'Meu perfil',
      icon: 'pi pi-file-edit',
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

    // Verificar token em ambos os locais
    const token = localStorage.getItem('token') || this.getTokenFromSessionStorage();
    
    if(token) {
      url = url + "?token=" + token;
    }

    window.location.href = url;
  }
  
  goToCursos(): void {
    let url = "https://login.ecocursos.com.br/portal/aluno/meus-cursos";

    // Verificar token em ambos os locais
    const token = localStorage.getItem('token') || this.getTokenFromSessionStorage();
    
    if(token) {
      url = url + "?token=" + token;
    }

    window.location.href = url;
  }
  
  goToPedidos(): void {
    let url = "https://login.ecocursos.com.br/portal/aluno/meus-pedidos";

    // Verificar token em ambos os locais
    const token = localStorage.getItem('token') || this.getTokenFromSessionStorage();
    
    if(token) {
      url = url + "?token=" + token;
    }

    window.location.href = url;
  }
  
  goToPerfil(): void {
    let url = "https://login.ecocursos.com.br/portal/aluno/meus-dados";
    
    // Verificar token em ambos os locais
    const token = localStorage.getItem('token') || this.getTokenFromSessionStorage();
    
    if(token) {
      url = url + "?token=" + token;
    }
  
    window.location.href = url; 
  }

  // Método auxiliar para extrair token do sessionStorage
  private getTokenFromSessionStorage(): string | null {
    const authHeader = sessionStorage.getItem('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7); // Remove 'Bearer ' do início
    }
    return null;
  }

  handleLogout(): void {
    // Limpar ambos os storages no logout
    localStorage.removeItem('token');
    sessionStorage.removeItem('Authorization');
    sessionStorage.removeItem('tipo');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('idUser');
    
    this.store.dispatch(LoginActions.logout());
  }
}