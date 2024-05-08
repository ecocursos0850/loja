import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { catchError, from, map, mergeMap, of, tap } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { MessageAction } from '../actions/message.actions';

@Injectable()
export class CreateMemberEffect {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private createMemberService = inject(CreateMemberService);

  addMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateMemberActions.createMember),
      mergeMap(({ member }) =>
        from(this.createMemberService.createMember(member)).pipe(
          map((createMember: CreateMemberRequiredProps) =>
            MemberCreatedApiActions.memberCreated({
              member: createMember
            })
          ),
          tap(() => {
            this.store.dispatch(
              MessageAction.sendMessage({
                message: {
                  severity: 'Success',
                  detail: `Member saved with success`
                }
              })
            );
          }),
          catchError((err: HttpErrorResponse) => {
            this.store.dispatch(
              MessageActions.sendMessage({
                message: {
                  severity: 'Error',
                  detail: `Member not added, ${err.message}`
                }
              })
            );
            return of(
              MemberCreatedApiActions.memberCreatedFailure({ error: err })
            );
          })
        )
      )
    )
  );
}
