import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class GroupMember extends Model {
  static tableName = DB_TABLES.GROUP_MEMBERS;
  id: string;
  groupMemberName: string;
  groupMemberRole?: string;
  joined?: Date;
  status?: string;
  group: string;
  churchMemberId?: string;
}

export type IGroupMember = ModelObject<GroupMember>;
