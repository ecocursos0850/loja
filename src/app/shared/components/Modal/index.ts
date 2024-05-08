import {
  Component,
  Injector,
  OnDestroy,
  OnInit,
  effect,
  inject,
  signal
} from '@angular/core';
import { ModalSelector } from '@shared/store/reducers/modal.reducer';

import { Store } from '@ngrx/store';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';

import { ModalAction } from '../../store/actions/modal.actions';
import { StatusProgressComponent } from '../StatusProgress';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [DialogModule, StatusProgressComponent],
  template: ``,
  providers: [DialogService, DynamicDialogRef]
})
export class ModalComponent implements OnInit, OnDestroy {
  private dialogService = inject(DialogService);
  private ref = inject(DynamicDialogRef);
  private store = inject(Store);
  private injector = inject(Injector);

  onOpen = signal<boolean>(false);
  onClose = signal<boolean>(false);

  ngOnInit(): void {
    this.getStateValue();
    this.checkChangesOnMethods();
  }

  getStateValue(): void {
    this.store.select(ModalSelector).subscribe({
      next: state => {
        if (state) {
          this.onOpen.update(() => state.open !== null);
          this.onClose.update(() => state.close);
        }
      }
    });
  }

  checkChangesOnMethods(): void {
    effect(
      () => {
        if (this.onOpen()) this.openModalConfig();
        if (this.onClose()) this.closeModal();
      },
      { injector: this.injector }
    );
  }

  openModalConfig(): void {
    this.ref = this.dialogService.open(StatusProgressComponent, {
      contentStyle: { overflow: 'auto' },
      styleClass: 'w-10 sm:w-9 mg:w-7 lg:w-5',
      baseZIndex: 1,
      maximizable: false,
      closable: false
    });
  }

  closeModal(): void {
    this.store.dispatch(ModalAction.enter());
    this.ref?.close();
  }

  ngOnDestroy(): void {
    if (this.ref) this.ref?.close();
  }
}
