import { CategoriesType } from './categories.interface';

interface SimulatedType {
  id: number;
  titulo: string;
  categoriaSimulado: CategoriesType;
}

interface QuestionType {
  id: number;
  descricao: string;
  simulado: SimulatedType;
}

interface ResponseType {
  id: number;
  resposta: string;
  correta: boolean;
  pergunta: QuestionType;
}

export class QuestionsType {
  id: number;
  descricao: string;
  respostas: ResponseType[];
}

export class SimulatedFromCategoriesType {
  id: number | string;
  titulo: string;
  categoriaSimulado: CategoriesType;
  perguntas: QuestionsType[];
}

export type SimulatedFromCategoriesRequiredType = Omit<
  QuestionType,
  'simulado'
>;

export type SimulatedFromQuestionsRequiredType = Omit<
  SimulatedFromCategoriesType,
  'categoriaSimulado'
>;
