import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class GroupChat extends Model {
  static tableName = DB_TABLES.GROUP_CHAT;
  id: string;
  groupMemberName: string;
  message: Text;
  group: string;
}

export type IGroupChat = ModelObject<GroupChat>;
