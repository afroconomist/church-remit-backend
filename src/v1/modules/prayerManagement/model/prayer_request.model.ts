import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class PrayerRequest extends Model {
  static tableName = DB_TABLES.PRAYER_REQUESTS;
  id: string;
  requestTitle: string;
  description: Text;
  category: string;
  urgency: string;
  privacySetting: string;
  assignedTo?: string;
  pray?: number;
  submittedBy?: string;
  prayerWarrior?: string;
  answered?: boolean;
  praySessions?: string[] | string;
  campusId?: string;
  church: string;
}

export type IPrayerRequest = ModelObject<PrayerRequest>;
