import { Injectable } from '@angular/core';
import { CreditCardType } from 'src/app/features/components/Payments/CreditCard';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {
  getData(): CreditCardType[] {
    return [
      {
        name: 'Visa',
        code: 'Visa',
        icon: '../../../assets/images/visa.svg'
      },
      {
        name: 'MasterCard',
        code: 'masterCard',
        icon: '../../../assets/images/masterCard.svg'
      },
      {
        name: 'American Express',
        code: 'american Express',
        icon: '../../../assets/images/american-express.svg'
      },
      {
        name: 'Elo',
        code: 'elo',
        icon: '../../../assets/images/elo.svg'
      },
      {
        name: 'DinnersClub',
        code: 'dinnersClub',
        icon: '../../../assets/images/dinnersClub.svg'
      },
      {
        name: 'Discover',
        code: 'discover',
        icon: '../../../assets/images/discover.svg'
      },
      {
        name: 'jcb',
        code: 'jcb',
        icon: '../../../assets/images/jcb.svg'
      },
      {
        name: 'aura',
        code: 'aura',
        icon: '../../../assets/images/aura.svg'
      }
    ];
  }

  getIcons(): Promise<CreditCardType[]> {
    return Promise.resolve(this.getData());
  }
}
