import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class Asset extends Model {
  static tableName = DB_TABLES.ASSETS;
  id: string;
  assetName: string;
  category: string;
  purchaseValue: number;
  purchaseDate: string;
  location: string;
  condition: string;
  groupId?: string;
  churchId: string;
}

export type IAsset = ModelObject<Asset>;
