import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { Category, ICategory } from "../model/category.model";

@injectable()
class CategoryRepository extends BaseRepository<ICategory, Category> {
  constructor() {
    super(Category);
  }
}

export default CategoryRepository;
