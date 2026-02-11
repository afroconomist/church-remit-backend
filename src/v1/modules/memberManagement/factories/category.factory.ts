import slugify from "slugify";
import { CreateCategory } from "../dtos/create-category.dto";
import { ICategory } from "../model/category.model";

class CategoryFactory {
  static createCategory(data: CreateCategory) {
    const category = {} as ICategory;

    category.categoryName = data.categoryName;
    category.description = data.description;
    category.categoryType = data.categoryType;
    category.slug = slugify(data.categoryName, { lower: true });
    category.churchId = data.churchId;

    return category;
  }
}

export default CategoryFactory;
