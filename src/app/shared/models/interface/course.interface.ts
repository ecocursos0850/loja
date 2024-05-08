export class CategoryType {
  id: number;
  titulo: string;
  status: number;
}

export interface MaterialType {
  id: number;
  titulo: string;
  link: string;
  ordenacao: number;
  tipoMaterial: number;
  anexos: [];
}

export interface CourseType {
  id: number;
  titulo: string;
  descricao: string;
  capa: string;
  categoria: CategoryType;
  materiais: MaterialType[];
  preco: number;
  precoMinimo: number;
  qtdParcelas: string;
  cargaHoraria: number;
  tipoCurso: number;
  status: number;
  promocao: boolean;
  descontoParceiro: boolean;
  conteudo: string;
  rodape: string;
  rodapeAfiliado: string;
}
