import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class Facility extends Model {
  static tableName = DB_TABLES.FACILITIES;
  id: string;
  facilityName: string;
  facilityType: string;
  capacity: number;
  location: string;
  features: Text;
  status?: string;
  eventBookedFor?: string;
  eventTime?: string;
  churchId: string;
}

export type IFacility = ModelObject<Facility>;
