import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import {
  CourseModuleLesson,
  ICourseModuleLesson,
} from "../model/course_module_lesson.model";

@injectable()
class CourseModuleLessonRepository extends BaseRepository<
  ICourseModuleLesson,
  CourseModuleLesson
> {
  constructor() {
    super(CourseModuleLesson);
  }
}

export default CourseModuleLessonRepository;
