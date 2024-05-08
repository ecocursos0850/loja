import { CourseType } from '@shared/models/interface/course.interface';

import { CategoriesModel } from '../classes/categories.model';

interface CoursesType extends CourseType {
  subCategoria: CategoriesModel;
}

export interface CategoriesTopicsType {
  id: number | string;
  titulo: string;
  cursos: CoursesType[];
  status: number;
  subCategorias: CategoriesModel[];
}
