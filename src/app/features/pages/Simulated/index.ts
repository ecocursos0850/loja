import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CardNavigationComponent } from '../../../core/components/CardNavigation';

@Component({
  selector: 'page-simulated',
  standalone: true,
  imports: [RouterOutlet, CardNavigationComponent],
  template: `
    <app-card-navigation />
    <div class="w-90rem m-auto mt-4" style="min-height:90vh">
      <router-outlet></router-outlet>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimulatedPageComponent {}
