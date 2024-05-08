import { Injectable } from '@angular/core';

import { ObjectiveCardType } from '../models/interface/objective-card.interface';

@Injectable({
  providedIn: 'root'
})
export class ObjectiveCardDataService {
  getObjectivesCardData(): ObjectiveCardType[] {
    return [
      {
        id: '1000',
        name: '14 anos de mercado',
        icon: 'pi-chart-bar',
        iconColor: `bg-blue-500`
      },
      {
        id: '1001',
        name: '+ de 1200 cursos disponíveis',
        icon: 'pi-comments',
        iconColor: `bg-red-500`
      },
      {
        id: '1002',
        name: '+ de 13 mil alunos',
        icon: 'pi-search-plus',
        iconColor: `bg-green-500`
      },
      {
        id: '1003',
        name: '+ de 15 sindicatos parceiros',
        icon: 'pi-sitemap',
        iconColor: `bg-yellow-500`
      }
    ];
  }

  getObjectivesCard(): Promise<ObjectiveCardType[]> {
    return Promise.resolve(this.getObjectivesCardData());
  }
}
