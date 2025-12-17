import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class FamilyMember extends Model {
  static tableName = DB_TABLES.FAMILY_MEMBERS;
  id: string;
  memberName: string;
  memberEmail: string;
  memberPhoneNumber?: string;
  memberDOB: Date;
  memberAddress: string;
  memberRelationship: string;
  primary?: boolean;
  familyId: string;
}

export type IFamilyMember = ModelObject<FamilyMember>;
