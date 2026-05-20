import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class ChurchEvent extends Model {
  static tableName = DB_TABLES.EVENTS;
  id: string;
  eventTitle: string;
  description: Text;
  category: string;
  location: string;
  eventDate: string;
  nextEventDate?: string;
  eventStartTime: string;
  eventEndTime: string;
  maximumCapacity: number;
  maximumCapacityTracker: number;
  registration: boolean;
  recurring?: boolean;
  eventFrequency?: "weekly" | "monthly" | "quarterly" | "yearly";
  upcoming?: boolean;
  past?: boolean;
  church: string;
}

export type IChurchEvent = ModelObject<ChurchEvent>;
