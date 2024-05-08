import { Component, inject, OnInit } from '@angular/core';
import { MessageKey } from '@shared/models/enum/message.enum';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { select, Store } from '@ngrx/store';

import { MessageAction } from '../../store/actions/message.actions';
import { MessageSelector } from '../../store/reducers/message.reducer';

@Component({
  selector: 'app-message',
  standalone: true,
  template: `
    <p-toast
      [showTransformOptions]="'translateY(100%)'"
      [showTransitionOptions]="'350ms'"
      [hideTransitionOptions]="'750ms'"
      [showTransformOptions]="'translateX(100%)'"
    />
  `,
  imports: [ToastModule],
  providers: [MessageService]
})
export class MessageComponent implements OnInit {
  private messageService = inject(MessageService);
  private store = inject(Store);

  ngOnInit(): void {
    this.store.pipe(select(MessageAction.enter));
    this.store.pipe(select(MessageSelector)).subscribe({
      next: result => {
        if (result) this.messageService.clear();
        const severity = result.severity?.toLowerCase() as MessageKey;
        this.messageService.add({
          severity: severity,
          summary: result.severity,
          detail: result.detail
        });
      }
    });
  }
}
