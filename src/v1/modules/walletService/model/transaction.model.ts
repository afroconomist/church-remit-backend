import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class Transaction extends Model {
  static tableName = DB_TABLES.TRANSACTIONS;
  id!: string;
  userId!: string;
  accountNumber!: string;
  transactionType!: string;
  transactionChannel!: string;
  recipientAccountNumber!: string;
  recipientBankCode!: string;
  recipientBankName!: string;
  recipientAccountName!: string;
  nameEnquiryReference!: string;
  amount!: number;
  status!: string;
  reference!: string;
  narration!: string;
  callBackURL!: string;
}

export type ITransaction = ModelObject<Transaction>;
