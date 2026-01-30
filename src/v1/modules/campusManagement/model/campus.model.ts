import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class Campus extends Model {
  static tableName = DB_TABLES.CAMPUSES;
  id: string;
  campusName: string;
  campusCode: string;
  campusAddress: string;
  campusEmail: string;
  campusPhoneNumber: string;
  campusPastor: string;
  financeManager?: string;
  legalName?: string;
  taxId?: string;
  registrationNumber?: string;
  localCurrency: string;
  timezone: string;
  established: string;
  status: string;
  churchId: string;
}

export type ICampus = ModelObject<Campus>;
