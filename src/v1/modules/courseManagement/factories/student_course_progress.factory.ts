import { TrackStudentCourseProgress } from "../dtos/student-course-progress.dto";
import { IStudentCourseProgress } from "../model/student_course_progress.model";

class StudentCourseProgressFactory {
  static trackStudentCourseProgress(data: TrackStudentCourseProgress) {
    const studentCourseProgress = {} as IStudentCourseProgress;

    studentCourseProgress.studentId = data.studentId;
    studentCourseProgress.courseId = data.courseId;
    studentCourseProgress.status = data.status;
    studentCourseProgress.startedAt = data.startedAt;
    studentCourseProgress.completedAt = data.completedAt;

    return studentCourseProgress;
  }
}

export default StudentCourseProgressFactory;
