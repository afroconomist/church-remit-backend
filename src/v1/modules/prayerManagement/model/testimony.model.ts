import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class Testimony extends Model {
  static tableName = DB_TABLES.TESTIMONIES;
  id: string;
  memberName: string;
  testimony: string;
  churchId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ITestimony = ModelObject<Testimony>;
