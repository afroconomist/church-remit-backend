import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class CourseModule extends Model {
  static tableName = DB_TABLES.COURSE_MODULES;
  id: string;
  moduleTitle: string;
  duration: string;
  order: number;
  lessons?: number;
  courseId: string;
}

export type ICourseModule = ModelObject<CourseModule>;
