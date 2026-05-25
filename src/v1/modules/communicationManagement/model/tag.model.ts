import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class Tag extends Model {
  static tableName = DB_TABLES.TAGS;
  id: string;
  tagName: string;
  description: string;
  color: string;
  defaultAssignment: string;
  slug: string;
  members?: number;
  campusId?: string;
  churchId: string;
}

export type ITag = ModelObject<Tag>;
