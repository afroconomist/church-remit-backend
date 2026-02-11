import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class MemberBirthday extends Model {
  static tableName = DB_TABLES.MEMBER_BIRTHDAYS;
  id: string;
  celebrantName: string;
  dateOfBirth: Date;
  celebrantEmail: string;
  celebrantPhone: string;
  campus: string;
  memberId: string;
  churchId: string;
}

export type IMemberBirthday = ModelObject<MemberBirthday>;
