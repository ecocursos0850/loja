import {
  CategoryType,
  CourseType
} from '@shared/models/interface/course.interface';

export class CartType {
  id: number;
  titulo: string;
  descricao: string;
  capa: string;
  preco: number;
  precoMinimo: number;
  qtdParcelas: string;
  cargaHoraria: number;
  tipoCurso: number;
  categoria: CategoryType;

  constructor(course: CourseType) {
    this.id = course.id;
    this.titulo = course.titulo;
    this.descricao = course.descricao;
    this.capa = course.capa;
    this.preco = course.preco;
    this.precoMinimo = course.precoMinimo;
    this.qtdParcelas = course.qtdParcelas;
    this.cargaHoraria = course.cargaHoraria;
    this.tipoCurso = course.tipoCurso;
    this.categoria = course.categoria;
  }
}
