import { AddCourseModule } from "../dtos/add-course-module.dto";
import { ICourseModule } from "../model/course_module.model";

class CourseModuleFactory {
  static addCourseModule(data: AddCourseModule) {
    const courseModule = {} as ICourseModule;

    courseModule.moduleTitle = data.moduleTitle;
    courseModule.duration = data.duration;
    courseModule.order = data.order;
    courseModule.lessons = data.lessons;
    courseModule.courseId = data.courseId;

    return courseModule;
  }
}

export default CourseModuleFactory;
