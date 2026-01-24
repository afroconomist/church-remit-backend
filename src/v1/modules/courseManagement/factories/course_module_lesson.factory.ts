import { AddCourseModuleLesson } from "../dtos/add-course-module-lesson.dto";
import { ICourseModuleLesson } from "../model/course_module_lesson.model";

class CourseModuleLessonFactory {
  static addCourseModuleLesson(data: AddCourseModuleLesson) {
    const courseModuleLesson = {} as ICourseModuleLesson;

    courseModuleLesson.lessonTitle = data.lessonTitle;
    courseModuleLesson.content = data.content;
    courseModuleLesson.duration = data.duration;
    courseModuleLesson.order = data.order;
    courseModuleLesson.moduleId = data.moduleId;

    return courseModuleLesson;
  }
}

export default CourseModuleLessonFactory;
