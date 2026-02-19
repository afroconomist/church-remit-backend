import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class BoardMember extends Model {
  static tableName = DB_TABLES.BOARD_MEMBERS;
  id: string;
  memberName: string;
  churchMemberId: string;
  discussionBoardId: string;
}

export type IBoardMember = ModelObject<BoardMember>;
