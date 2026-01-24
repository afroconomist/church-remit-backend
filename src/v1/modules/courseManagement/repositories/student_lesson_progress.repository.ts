import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import {
  StudentLessonProgress,
  IStudentLessonProgress,
} from "../model/student_lesson_progress.model";

@injectable()
class StudentLessonProgressRepository extends BaseRepository<
  IStudentLessonProgress,
  StudentLessonProgress
> {
  constructor() {
    super(StudentLessonProgress);
  }
}

export default StudentLessonProgressRepository;
