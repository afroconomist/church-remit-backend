import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { Course, ICourse } from "../model/course.model";

@injectable()
class CourseRepository extends BaseRepository<ICourse, Course> {
  constructor() {
    super(Course);
  }
}

export default CourseRepository;
