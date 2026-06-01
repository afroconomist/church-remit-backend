import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class VolunteerRoleAssignment extends Model {
  static tableName = DB_TABLES.VOLUNTEER_ROLE_ASSIGNMENTS;
  id: string;
  volunteerId: string;
  volunteerRoleId: string;
  assignedAt: Date;
  status: "ACTIVE" | "INACTIVE" | "COMPLETED";
  createdAt?: Date;
  updatedAt?: Date;
}

export type IVolunteerRoleAssignment = ModelObject<VolunteerRoleAssignment>;
