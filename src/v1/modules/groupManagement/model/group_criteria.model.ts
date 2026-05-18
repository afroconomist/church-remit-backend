import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class GroupCriteria extends Model {
  static tableName = DB_TABLES.GROUP_CRITERIAS;
  id: string;
  criteriaType: "age" | "gender" | "marital-status";
  minAge?: number;
  maxAge?: number;
  gender?: string;
  maritalStatus?: string;
  groupId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IGroupCriteria = ModelObject<GroupCriteria>;
