export class CategoriesModel {
  id: number | string;
  status: number;
  titulo: string;

  constructor(status = 1) {
    this.status = status;
  }
}
