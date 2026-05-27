import { EnrollStudent } from "../dtos/enroll-student.dto";
import { IStudent } from "../model/student.model";

class StudentFactory {
  static enrollStudent(data: EnrollStudent) {
    const student = {} as IStudent;

    student.studentName = data.studentName;
    student.role = data.role;
    student.department = data.department;
    student.memberId = data.memberId;
    student.courseId = data.courseId;
    student.churchId = data.churchId;

    return student;
  }
}

export default StudentFactory;
