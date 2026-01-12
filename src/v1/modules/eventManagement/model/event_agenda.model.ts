import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class EventAgenda extends Model {
  static tableName = DB_TABLES.EVENT_AGENDAS;
  id: string;
  time: string;
  duration: string;
  title: string;
  description: Text;
  assignedTo: string;
  role: string;
  churchEvent: string;
}

export type IEventAgenda = ModelObject<EventAgenda>;
