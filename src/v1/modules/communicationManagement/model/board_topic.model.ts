import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class BoardTopic extends Model {
  static tableName = DB_TABLES.BOARD_TOPICS;
  id: string;
  topicTitle: string;
  message: Text;
  startedBy: string;
  replies?: number;
  lastInteracted?: string;
  discussionBoardId: string;
}

export type IBoardTopic = ModelObject<BoardTopic>;
