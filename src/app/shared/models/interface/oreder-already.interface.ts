export interface OrderAlready {
  id: number;
  aluno: Student;
  cursos: Course[];
  status: number;
  tipoPagamentos: number[];
  dataPedido: Date;
  qtdItens: number;
  referencia: string;
  subtotal: number;
  descontos: number;
  cargaHorariaTotal: string;
  total: number;
  linkPagamento: string;
  isento: number;
  taxaMatricula: number;
}

export interface Student {
  id: number;
  nome: string;
}

export interface Course {
  id: number;
  titulo: string;
}
