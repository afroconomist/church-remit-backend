import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class CampusPersonnel extends Model {
  static tableName = DB_TABLES.CAMPUS_PERSONNELS;
  id: string;
  personnelType: string;
  personnelName: string;
  department: string;
  memberId: string;
  campusId: string;
}

export type ICampusPersonnel = ModelObject<CampusPersonnel>;
