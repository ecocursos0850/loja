import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  signal
} from '@angular/core';
import { PaginatorModel } from '@shared/models/classes/paginator.model';

import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { SliderModule } from 'primeng/slider';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [PaginatorModule, ButtonModule, DividerModule, SliderModule],
  template: `
    <div class="flex w-full align-items-center justify-content-center">
      <p-paginator
        (onPageChange)="onPageChange($event)"
        [first]="firstNumber"
        [rows]="rowsNumber"
        [totalRecords]="totalRecords"
        [pageLinkSize]="3"
        [rowsPerPageOptions]="[3, 6, 9, 16, 32]"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent {
  @Input() totalRecords: number = 0;

  @Output() pageChange = new EventEmitter<PaginatorModel>();
  @Output() rows = new EventEmitter<number>();

  firstNumber: number = 0;
  rowsNumber: number = 6;
  pageLinkSize = signal<number>(3);

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    if (window.innerWidth < 600) this.pageLinkSize.update(() => 2);
    else this.pageLinkSize.update(() => 5);
  }

  onPageChange(event: any): void {
    this.pageChange.emit(event);

    this.firstNumber = event.first;
    this.rowsNumber = event.rows;
  }
}
