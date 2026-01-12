import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class EventVolunteer extends Model {
  static tableName = DB_TABLES.EVENT_VOLUNTEERS;
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  churchEvent: string;
}

export type IEventVolunteer = ModelObject<EventVolunteer>;
