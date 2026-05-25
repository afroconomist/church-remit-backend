import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class Student extends Model {
  static tableName = DB_TABLES.STUDENTS;
  id: string;
  studentName: string;
  role: string;
  department: string;
  isEnrolled: boolean;
  memberId: string;
  courseId: string;
  campusId?: string;
  churchId: string;
}

export type IStudent = ModelObject<Student>;
