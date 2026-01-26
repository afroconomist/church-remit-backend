import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { CourseModule, ICourseModule } from "../model/course_module.model";

@injectable()
class CourseModuleRepository extends BaseRepository<
  ICourseModule,
  CourseModule
> {
  constructor() {
    super(CourseModule);
  }
}

export default CourseModuleRepository;
