import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class Newsletter extends Model {
  static tableName = DB_TABLES.NEWSLETTERS;
  id: string;
  newsletterTitle: string;
  emailSubjectLine: string;
  emailContent: Text;
  audience: string;
  includeAttachements?: boolean;
  sendImmediately?: boolean;
  sendDate?: Date;
  sendTime?: string;
  postedAt: Date;
  recipients?: number;
  churchId: string;
}

export type INewsletter = ModelObject<Newsletter>;
