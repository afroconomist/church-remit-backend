import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class StudentModuleProgress extends Model {
  static tableName = DB_TABLES.STUDENT_MODULE_PROGRESSES;
  id: string;
  studentId: string;
  moduleId: string;
  status?: string;
  startedAt: Date;
  completedAt?: Date;
}

export type IStudentModuleProgress = ModelObject<StudentModuleProgress>;
