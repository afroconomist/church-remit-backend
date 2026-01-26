import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class StudentLessonProgress extends Model {
  static tableName = DB_TABLES.STUDENT_LESSON_PROGRESSES;
  id: string;
  studentId: string;
  lessonId: string;
  status?: string;
  startedAt: Date;
  completedAt?: Date;
}

export type IStudentLessonProgress = ModelObject<StudentLessonProgress>;
