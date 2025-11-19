import { DB_TABLES } from "@shared/enums/db-tables.enum";
// import { ObjectLiteral } from "@shared/types/object-literal.type";
import { Model, ModelObject } from "objection";
import bcrypt from "bcrypt";


export class OTP extends Model {
  static tableName = DB_TABLES.OTP;
  id!: string;
  userId!: string;
  token!: string;
  expiringDatetime!: Date;
  status!: number;
  otpType!: string;
  createdAt!: Date;
  updatedAt!: Date;


}

export type IOTP = ModelObject<OTP>;
