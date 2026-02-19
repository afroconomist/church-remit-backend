import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class TopicReply extends Model {
  static tableName = DB_TABLES.TOPIC_REPLIES;
  id: string;
  message: string;
  repliedBy: string;
  boardTopicId: string;
}

export type ITopicReply = ModelObject<TopicReply>;
