import { Injectable, inject } from '@angular/core';
import { LoadingAction } from '@shared/store/actions/loading.actions';

import { Observable, of, switchMap } from 'rxjs';

import { Store } from '@ngrx/store';

import { CategoriesTopicsService } from './categories-topics.service';
class ItemsModel {
  id: string | number;
  label: string;
  queryParams?: any;
  icon?: string;
  routerLink?: string[];
  items?: Array<ItemsModel | null>;

  constructor(label: string) {
    this.label = label;
  }
}
@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  private store = inject(Store);
  private categoriesTopicsService = inject(CategoriesTopicsService);
  baseCourseUrl = '/categorias/';
  model: any[] = [];

  desiredOrder = [
    'ECO CLUB',
    'DIREITO ONLINE',
    'CONCURSOS / EXAME DA OAB',
    'PROFISSIONALIZANTES ',
    'GRADUAÇÃO',
    '2ª GRADUAÇÃO',
    'PÓS-GRADUAÇÃO / MBA'
  ];

  getFilters(
    hasIcons: boolean,
    hasLinkToItems: boolean,
    typeMenu: string,
    label: string
  ): Observable<any[]> {
    this.store.dispatch(LoadingAction.loading({ message: true }));
    return this.categoriesTopicsService.getAllCategoriesTopics().pipe(
      switchMap(value => {
        const itemsWithSubcategories: ItemsModel[] = [];

        this.desiredOrder!.forEach(desiredItem => {
          const matchingItem = value.find(
            res => res.titulo.toLowerCase() === desiredItem.toLowerCase()
          );

          if (matchingItem) {
            const items = new ItemsModel(matchingItem.titulo);
            if (hasIcons) items.icon = 'pi pi-fw pi-book';
            if (hasLinkToItems) {
              items.routerLink = [`${this.baseCourseUrl}`];
              items.queryParams = { type: 'categoria', id: matchingItem.id };
            }
            items.id = matchingItem.id.toString();

            const subCategoriaItems: ItemsModel[] = [];

            if (
              matchingItem.subCategorias &&
              matchingItem.subCategorias?.length
            ) {
              console.log(this.desiredOrder);
              matchingItem.subCategorias?.forEach(subCategoria => {
                if (subCategoria) {
                  const subCategoriaId = subCategoria.id.toString();
                  const subCategoriaItem = subCategoriaItems.find(
                    item => item.id === subCategoriaId
                  );

                  if (!subCategoriaItem) {
                    const newSubCategoriaItem = new ItemsModel(
                      subCategoria.titulo
                    );
                    newSubCategoriaItem.id = subCategoriaId;
                    newSubCategoriaItem.routerLink = [`${this.baseCourseUrl}`];
                    newSubCategoriaItem.icon = 'pi pi-fw pi-book';
                    newSubCategoriaItem.queryParams = {
                      type: 'subcategoria',
                      id: subCategoria.id
                    };

                    subCategoriaItems.push(newSubCategoriaItem);
                  }
                }
              });
            }

            items.items = subCategoriaItems;
            itemsWithSubcategories.push(items);
          }
        });

        itemsWithSubcategories.forEach(category => {
          if (category.items && category.items.length > 0) {
            category.items.sort((a: any, b: any): any => {
              const locale = 'pt';
              const options = { sensitivity: 'base' };
              return a.label.localeCompare(b.label, locale, options);
            });
          }
        });

        this.model =
          typeMenu === 'sidebar'
            ? [
                {
                  label: label,
                  items: itemsWithSubcategories,
                  routerBaseUrl: this.baseCourseUrl
                }
              ]
            : itemsWithSubcategories;

        this.store.dispatch(LoadingAction.loading({ message: false }));
        return of(this.model);
      })
    );
  }
}
