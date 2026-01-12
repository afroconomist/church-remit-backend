import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class EventReview extends Model {
  static tableName = DB_TABLES.EVENT_REVIEWS;
  id: string;
  submittedBy: string;
  eventReview: Text;
  churchEvent: string;
}

export type IEventReview = ModelObject<EventReview>;
