import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class EventAttendee extends Model {
  static tableName = DB_TABLES.EVENT_ATTENDEES;
  id: string;
  name: string;
  status: string;
  checkedIn: boolean;
  churchEvent: string;
}

export type IEventAttendee = ModelObject<EventAttendee>;
