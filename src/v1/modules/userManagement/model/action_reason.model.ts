import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class ActionReason extends Model {
  static tableName = DB_TABLES.ACTION_REASONS;
  id!: string;
  userId!: string;
  action!: string;
  reason!: string;
}

export type IActionReason = ModelObject<ActionReason>;