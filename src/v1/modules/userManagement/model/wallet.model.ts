import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class Wallet extends Model {
  static tableName = DB_TABLES.WALLETS;
  id!: string;
  userId!: string;
  accountNumber!: string;
  balance!: number;
  ledgerBalance!: number;
  createdAt!: Date;
  updatedAt!: Date;


}

export type IWallet = ModelObject<Wallet>;
