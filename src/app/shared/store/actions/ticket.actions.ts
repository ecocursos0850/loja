import { HttpErrorResponse } from '@angular/common/http';
import { BankSlipModel } from '@shared/models/classes/bank-slip.model';
import { PDFType } from '@shared/models/interface/pdf.interface';

import { createActionGroup, emptyProps, props } from '@ngrx/store';

export interface TicketState {
  response: PDFType | null;
  currentTicketSend: BankSlipModel | null;
  totalPayment: number;
  error: HttpErrorResponse | null;
}

export const TicketActions = createActionGroup({
  source: 'Ticket',
  events: {
    Enter: emptyProps(),
    'Select Ticket': props<{ ticket: BankSlipModel }>(),
    'Select Total Payment': props<{ total: number }>()
  }
});

export const TicketApiActions = createActionGroup({
  source: 'Ticket Api',
  events: {
    'Ticket Loaded Success': props<{
      ticket: PDFType | null;
    }>(),
    'Ticket Loaded Failed': props<{ error: HttpErrorResponse }>()
  }
});
