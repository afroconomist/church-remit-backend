import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class Volunteer extends Model {
  static tableName = DB_TABLES.VOLUNTEERS;
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  skills: string[] | string;
  availability: string[] | string;
  totalHours?: number;
  memberSince: Date;
  lastServed?: Date;
  backgroundCheck?: boolean;
  awards?: number;
  volunteerRoleName?: string;
  section?: string;
  volunteerRole?: string;
  church: string;
}

export type IVolunteer = ModelObject<Volunteer>;
