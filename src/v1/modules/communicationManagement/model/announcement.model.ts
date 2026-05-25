import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class Announcement extends Model {
  static tableName = DB_TABLES.ANNOUNCEMENTS;
  id: string;
  title: string;
  content: Text;
  category: string;
  priority: string;
  startDate: Date;
  endDate?: Date;
  displayOnWebsite?: boolean;
  sendEmailNotification?: boolean;
  sendSMSNotification?: boolean;
  campusId?: string;
  churchId: string;
}

export type IAnnouncement = ModelObject<Announcement>;
