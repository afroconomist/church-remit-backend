import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class Circular extends Model {
  static tableName = DB_TABLES.CIRCULARS;
  id: string;
  title: string;
  description: string;
  province: string;
  category: string;
  documentUrl: string;
  uploadedAt: string;
  downloads?: number;
  campusId?: string;
  churchId: string;
}

export type ICircular = ModelObject<Circular>;
