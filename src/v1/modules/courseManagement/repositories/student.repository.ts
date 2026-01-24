import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { Student, IStudent } from "../model/student.model";

@injectable()
class StudentRepository extends BaseRepository<IStudent, Student> {
  constructor() {
    super(Student);
  }
}

export default StudentRepository;
