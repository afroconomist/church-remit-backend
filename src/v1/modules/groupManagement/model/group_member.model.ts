import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class GroupMember extends Model {
  static tableName = DB_TABLES.GROUP_MEMBERS;
  id: string;
  groupMemberName: string;
  groupMemberRole?: string;
  joined?: Date;
  status?: string;
  present?: boolean;
  absent?: boolean;
  excused?: boolean;
  group: string;
  churchMemberId?: string;
}

export type IGroupMember = ModelObject<GroupMember>;
