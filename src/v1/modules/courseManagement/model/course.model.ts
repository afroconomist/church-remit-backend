import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class Course extends Model {
  static tableName = DB_TABLES.COURSES;
  id: string;
  courseTitle: string;
  description: Text;
  category: string;
  totalDuration: string;
  passingScore: number;
  enrollmentType: string;
  mandatoryCourse?: boolean;
  modules?: number;
  enrolled?: number;
  campusId?: string;
  churchId: string;
}

export type ICourse = ModelObject<Course>;
