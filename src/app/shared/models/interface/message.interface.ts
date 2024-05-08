type SeverityType = '' | 'Success' | 'Error' | 'Info' | 'Warn';

export class MessageModel {
  severity: SeverityType;
  detail: string;
}
