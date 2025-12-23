import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";
import { Family } from "./family.model";

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
  family: string;

  static relationMappings = {
    memberFamily: {
      relation: Model.BelongsToOneRelation,
      modelClass: Family,
      join: {
        from: "family_members.family",
        to: "families.id",
      },
    },
  };
}

export type IFamilyMember = ModelObject<FamilyMember>;
