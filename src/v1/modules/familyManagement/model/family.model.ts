import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";
import { FamilyMember } from "./family_member.model";

export class Family extends Model {
  static tableName = DB_TABLES.FAMILIES;
  id: string;
  primaryMember: string;
  familyAddress: string;

  static relationMappings = {
    familyMembers: {
      relation: Model.HasManyRelation,
      modelClass: FamilyMember,
      join: {
        from: "families.id",
        to: "family_members.family",
      },
    },
  };
}

export type IFamily = ModelObject<Family>;
