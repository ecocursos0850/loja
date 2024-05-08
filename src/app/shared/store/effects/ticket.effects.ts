import { inject, Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingAction } from '@shared/store/actions/loading.actions';
import { TicketService } from '@shared/services/ticket.service';
import { PDFType } from '@shared/models/interface/pdf.interface';

import { catchError, from, map, of, switchMap, tap } from 'rxjs';

import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { CartActions } from '../actions/cart.actions';
import { TicketActions, TicketApiActions } from '../actions/ticket.actions';

@Injectable()
export class TicketEffect {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private ticketService = inject(TicketService);

  pdfLink = signal<string>('');

  addTicket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketActions.selectTicket),
      tap(() => {
        this.store.dispatch(LoadingAction.loading({ message: true }));
      }),
      switchMap(({ ticket }) =>
        from(
          this.ticketService.ticketPayment(ticket).pipe(
            map((ticketData: PDFType) => {
              this.pdfLink.update(() => ticketData.pdf);
              return TicketApiActions.ticketLoadedSuccess({
                ticket: ticketData
              });
            }),
            tap(() => {
              this.store.dispatch(CartActions.clearAllItemsToCart());
              this.store.dispatch(LoadingAction.loading({ message: false }));
            }),
            catchError((err: HttpErrorResponse) => {
              this.store.dispatch(LoadingAction.loading({ message: false }));
              return of(TicketApiActions.ticketLoadedFailed({ error: err }));
            })
          )
        )
      )
    )
  );
}
