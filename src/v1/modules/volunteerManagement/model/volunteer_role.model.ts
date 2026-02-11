import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class VolunteerRole extends Model {
  static tableName = DB_TABLES.VOLUNTEER_ROLES;
  id: string;
  name: string;
  section: string;
  scheduledDate: Date;
  noOfVolunteersNeeded: number;
  startTime: string;
  endTime: string;
  church: string;
  groupId?: string;
}

export type IVolunteerRole = ModelObject<VolunteerRole>;
