import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import {
  StudentCourseProgress,
  IStudentCourseProgress,
} from "../model/student_course_progress.model";

@injectable()
class StudentCourseProgressRepository extends BaseRepository<
  IStudentCourseProgress,
  StudentCourseProgress
> {
  constructor() {
    super(StudentCourseProgress);
  }
}

export default StudentCourseProgressRepository;
