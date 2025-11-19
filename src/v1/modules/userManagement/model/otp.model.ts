import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";



export class OTP extends Model {
  static tableName = DB_TABLES.OTP;
  id!: string;
  userId!: string;
  token!: string;
  expiringDatetime!: Date;
  status!: string;
  otpType!: string;
}

export type IOTP = ModelObject<OTP>;
