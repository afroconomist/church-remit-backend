import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class PrayerRequestComment extends Model {
  static tableName = DB_TABLES.PRAYER_REQUEST_COMMENTS;
  id: string;
  commentedBy: string;
  message: string;
  prayerRequestId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IPrayerRequestComment = ModelObject<PrayerRequestComment>;
