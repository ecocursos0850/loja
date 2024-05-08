import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { MessageModel } from '../../models/interface/message.interface';

export const MessageAction = createActionGroup({
  source: 'Message',
  events: {
    Enter: emptyProps(),
    'Send Message': props<{ message: MessageModel }>()
  }
});
