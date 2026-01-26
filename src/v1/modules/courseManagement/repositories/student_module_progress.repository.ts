import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import {
  StudentModuleProgress,
  IStudentModuleProgress,
} from "../model/student_module_progress.model";

@injectable()
class StudentModuleProgressRepository extends BaseRepository<
  IStudentModuleProgress,
  StudentModuleProgress
> {
  constructor() {
    super(StudentModuleProgress);
  }
}

export default StudentModuleProgressRepository;
