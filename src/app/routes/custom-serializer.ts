import { RouterStateSnapshot } from '@angular/router';

import { RouterStateSerializer } from '@ngrx/router-store';

import { RouterStateInterface } from '../shared/models/interface/router-state.interface';

export class CustomSerializer
  implements RouterStateSerializer<RouterStateInterface>
{
  serialize(routerState: RouterStateSnapshot): RouterStateInterface {
    let route = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const {
      url,
      root: { queryParams }
    } = routerState;
    const { params } = route;

    return { url, params, queryParams };
  }
}
