import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class Category extends Model {
  static tableName = DB_TABLES.CATEGORIES;
  id: string;
  categoryName: string;
  description: Text;
  categoryType: string;
  slug?: string;
  members?: number;
  churchId: string;
}

export type ICategory = ModelObject<Category>;
