import { DB_TABLES } from "@shared/enums/db-tables.enum";
// import { ObjectLiteral } from "@shared/types/object-literal.type";
import { Model, ModelObject } from "objection";
import bcrypt from "bcrypt";


export class IDVerification extends Model {
  static tableName = DB_TABLES.IDVERIFICATION;
  id!: string;
  userId!: string;
  idType!: string;
  idNumber!: string;
  issuingDate!: Date;
  expiringDate!: Date;
  createdAt!: Date;
  updatedAt!: Date;


}

export type IDV = ModelObject<IDVerification>;
