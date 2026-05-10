import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class Document extends Model {
  static tableName = DB_TABLES.DOCUMENTS;
  id: string;
  documentName: string;
  category: string;
  confidentiality: string;
  documentUrl: string;
  churchId: string;
}

export type IDocument = ModelObject<Document>;
