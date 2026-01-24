import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class StudentCourseProgress extends Model {
  static tableName = DB_TABLES.STUDENT_COURSE_PROGRESSES;
  id: string;
  studentId: string;
  courseId: string;
  status?: string;
  startedAt: Date;
  completedAt?: Date;
}

export type IStudentCourseProgress = ModelObject<StudentCourseProgress>;
