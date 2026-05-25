import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class News extends Model {
  static tableName = DB_TABLES.NEWS;
  id: string;
  headline: string;
  shortSummary: Text;
  fullArticle: Text;
  media?: Text;
  province: string;
  views?: number;
  publishDate: Date;
  publishTime: string;
  postedAt: Date;
  featureThisNews?: boolean;
  showOnHomepage?: boolean;
  campusId?: string;
  churchId: string;
}

export type INews = ModelObject<News>;
