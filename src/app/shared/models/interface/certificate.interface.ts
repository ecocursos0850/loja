import { CourseType } from './course.interface';

export class Certificate {
  id: string;
  matricula: CertificateMatricula;
  dataCadastro: Date;
}

export interface CertificateMatricula {
  id: number;
  dataMatricula: string;
  dataLiberacao: string;
  curso: CourseType;
  aluno: Student;
  valorCurso: number;
  valorMatricula: number;
  observacao: string;
  nomeVendedor: string;
  status: number;
  formaPagamento: string;
  diaPagamento: string;
  qtdParcelas: number;
  valorParcelas: number;
  declaracoes: any[];
  cargaHoraria: number;
  alunoAvaliacao: AlunoAvaliacao;
}

export interface Student {
  id: number;
  nome: string;
  status: number;
  dataCadastro: string;
  email: string;
  sexo: string;
  cpf: string;
  rg: string;
  orgaoEmissor: string;
  nomePai: string;
  nomeMae: string;
  faculdade: string;
  anoConclusao: string;
  telefoneFixo: string;
  idade: string;
  dataNascimento: string;
  celular: string;
  receberEmail: boolean;
  cep: string;
  logradouro: string;
  cidade: string;
  estado: string;
  bairro: string;
  numero: string;
  referencia: string;
  emailAniversario: boolean;
  tentativas: number;
  parceiro: Parceiro;
  matriculas: MatriculaElement[];
}

export interface MatriculaElement {
  id: number;
}

export interface Parceiro {
  id: number;
  nome: string;
  porcentagemDesconto: string;
}

export interface AlunoAvaliacao {
  id: number;
  aluno: Student;
  avaliacao: Avaliacao;
  acertos: number;
  aprovado: boolean;
  finalizada: boolean;
}

export interface Avaliacao {
  id: number;
  titulo: string;
  curso: CourseType;
  status: number;
  perguntas: Pergunta[];
}

export interface Material {
  id: number;
  titulo: string;
  link?: string;
  ordenacao?: number;
  tipoMaterial: number;
  anexos: Anexo[];
}

export interface Anexo {
  id: number;
  caminho?: string;
}

export interface Pergunta {
  id: number;
  titulo: string;
  valor: number;
  ordem?: number;
  avaliacaoRespostas: AvaliacaoResposta[];
}

export interface AvaliacaoResposta {
  id: number;
  descricao: string;
  ordem?: number;
  correta: boolean;
}
