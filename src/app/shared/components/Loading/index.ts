import { Component, inject, OnInit, signal } from '@angular/core';
import { LoadingAction } from '@shared/store/actions/loading.actions';
import { LoadingSelector } from '@shared/store/reducers/loading.reducer';
import { NgIf } from '@angular/common';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { select, Store } from '@ngrx/store';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [ProgressSpinnerModule, NgIf, DialogModule],
  template: `
    <p-dialog
      [visible]="isLoading()"
      [modal]="true"
      [style]="{ width: '12rem' }"
      [draggable]="false"
      [resizable]="false"
      [closable]="false"
      contentStyleClass="flex justify-content-center"
    >
      <p-progressSpinner />
    </p-dialog>
  `
})
export class LoadingComponent implements OnInit {
  private store = inject(Store);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.store.pipe(select(LoadingAction.enter));

    this.store.pipe(select(LoadingSelector)).subscribe({
      next: result => {
        this.isLoading.set(result.isLoading);
      }
    });
  }
}
