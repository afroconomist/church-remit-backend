import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class EventBudget extends Model {
  static tableName = DB_TABLES.EVENT_BUDGETS;
  id: string;
  category: string;
  itemDescription: string;
  budgetedAmount: number;
  actualAmount: number;
  variance: number;
  status: string;
  eventId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IEventBudget = ModelObject<EventBudget>;
