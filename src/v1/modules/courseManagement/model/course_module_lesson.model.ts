import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class CourseModuleLesson extends Model {
  static tableName = DB_TABLES.COURSE_MODULE_LESSONS;
  id: string;
  lessonTitle: string;
  content: string;
  duration: string;
  order: number;
  moduleId: string;
}

export type ICourseModuleLesson = ModelObject<CourseModuleLesson>;
