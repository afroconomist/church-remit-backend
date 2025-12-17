import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class Family extends Model {
  static tableName = DB_TABLES.FAMILIES;
  id: string;
  primaryMember: string;
  familyAddress: string;
}

export type IFamily = ModelObject<Family>;
