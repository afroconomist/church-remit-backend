import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class Church extends Model {
  static tableName = DB_TABLES.CHURCHES;
  id!: string;
  churchName!: string;
  churchType!: string;
  email!: string;
  phoneNumber!: string;
  website: string | null;
  streetAddress!: string;
  city!: string;
  stateRegion!: string;
  country!: string;
  timeZone!: string;
  baseCurrency!: string;
  fiscalYearStart!: Date;
  initialFundsToCreate!: string[];
  digitalGivingAndDonations!: boolean;
  expenseManagement!: boolean;
  payrollManagement!: boolean;
  memberManagement!: boolean;
  digitalGiving!: boolean;
  eventsAndCheckIn!: boolean;
  smallGroups!: boolean;
  volunteerManagement!: boolean;
  communications!: boolean;
  facilities!: boolean;
  mediaLibrary!: boolean;
}

export type IChurch = ModelObject<Church>;
