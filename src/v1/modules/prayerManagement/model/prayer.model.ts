import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class Prayer extends Model {
  static tableName = DB_TABLES.PRAYERS;
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
  church: string;
}

export type IPrayer = ModelObject<Prayer>;
