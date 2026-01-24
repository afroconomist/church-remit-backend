import { TrackStudentModuleProgress } from "../dtos/student-module-progress.dto";
import { IStudentModuleProgress } from "../model/student_module_progress.model";

class StudentModuleProgressFactory {
  static trackStudentModuleProgress(data: TrackStudentModuleProgress) {
    const studentModuleProgress = {} as IStudentModuleProgress;

    studentModuleProgress.studentId = data.studentId;
    studentModuleProgress.moduleId = data.moduleId;
    studentModuleProgress.status = data.status;
    studentModuleProgress.startedAt = data.startedAt;
    studentModuleProgress.completedAt = data.completedAt;

    return studentModuleProgress;
  }
}

export default StudentModuleProgressFactory;
