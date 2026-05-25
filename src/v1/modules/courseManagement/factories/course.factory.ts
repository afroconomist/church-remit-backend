import { CreateCourse } from "../dtos/create-course.dto";
import { ICourse } from "../model/course.model";

class CourseFactory {
  static createCourse(data: CreateCourse) {
    const course = {} as ICourse;

    course.courseTitle = data.courseTitle;
    course.description = data.description;
    course.category = data.category;
    course.totalDuration = data.totalDuration;
    course.passingScore = data.passingScore;
    course.enrollmentType = data.enrollmentType;
    course.mandatoryCourse = data.mandatoryCourse;
    course.modules = data.modules;
    course.enrolled = data.enrolled;
    course.campusId = data.campusId;
    course.churchId = data.churchId;

    return course;
  }
}

export default CourseFactory;
