export class OrderModel {
  aluno: IdModel;
  cursos: IdModel[];
  status: number;
  tipoPagamentos: number[];
  subtotal: number;
  descontos: number;
  isento: number;
  taxaMatricula: number;
}

export class IdModel {
  id: string | number;
}
