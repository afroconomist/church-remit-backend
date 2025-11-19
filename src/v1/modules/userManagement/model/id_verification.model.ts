import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class IdVerification extends Model {
  static tableName = DB_TABLES.IDVERIFICATION;
  id!: string;
  userId!: string;
  idType!: string;
  idNumber!: string;
  issuingDate!: Date;
  expiringDate!: Date;

}

export type IDV = ModelObject<IdVerification>;
