import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class Wallet extends Model {
  static tableName = DB_TABLES.WALLETS;
  id!: string;
  userId!: string;
  walletId!: string;
  accountNumber!: string;
  balance!: number;
}

export type IWallet = ModelObject<Wallet>;
