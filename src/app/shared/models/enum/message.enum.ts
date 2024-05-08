export enum MessageEnum {
  'Sucesso' = 'success',
  'Cuidado' = 'warn',
  'Erro' = 'error'
}
export type MessageKey = keyof typeof MessageEnum;
