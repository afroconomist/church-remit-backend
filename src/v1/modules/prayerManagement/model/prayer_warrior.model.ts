import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class PrayerWarrior extends Model {
  static tableName = DB_TABLES.PRAYER_WARRIORS;
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  assigned?: number;
  completed?: number;
  avgResponse?: string;
  church: string;
}

export type IPrayerWarrior = ModelObject<PrayerWarrior>;
