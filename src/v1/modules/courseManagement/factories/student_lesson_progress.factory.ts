import { TrackStudentLessonProgress } from "../dtos/student-lesson-progress.dto";
import { IStudentLessonProgress } from "../model/student_lesson_progress.model";

class StudentLessonProgressFactory {
  static trackStudentLessonProgress(data: TrackStudentLessonProgress) {
    const studentLessonProgress = {} as IStudentLessonProgress;

    studentLessonProgress.studentId = data.studentId;
    studentLessonProgress.lessonId = data.lessonId;
    studentLessonProgress.status = data.status;
    studentLessonProgress.startedAt = data.startedAt;
    studentLessonProgress.completedAt = data.completedAt;

    return studentLessonProgress;
  }
}

export default StudentLessonProgressFactory;
