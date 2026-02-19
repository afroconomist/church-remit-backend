import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class DiscussionBoard extends Model {
  static tableName = DB_TABLES.DISCUSSION_BOARDS;
  id: string;
  boardName: string;
  description: string;
  welcomeMessage: string;
  visibility: string;
  whoCanPost: string;
  notifyMembers: boolean;
  topics?: number;
  members?: number;
  lastActive?: string;
  churchId: string;
}

export type IDiscussionBoard = ModelObject<DiscussionBoard>;
