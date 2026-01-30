import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class FacilityBooking extends Model {
  static tableName = DB_TABLES.FACILITY_BOOKINGS;
  id: string;
  eventName: string;
  startTime: Date;
  endTime: Date;
  purpose: string;
  facilityId: string;
}

export type IFacilityBooking = ModelObject<FacilityBooking>;
