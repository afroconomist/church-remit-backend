import { injectable } from "tsyringe";
import CourseFactory from "../factories/course.factory";
import CourseRepository from "../repositories/course.repository";
import StudentFactory from "../factories/student.factory";
import StudentRepository from "../repositories/student.repository";
import CourseModuleFactory from "../factories/course_module.factory";
import CourseModuleRepository from "../repositories/course_module.repository";
import CourseModuleLessonFactory from "../factories/course_module_lesson.factory";
import CourseModuleLessonRepository from "../repositories/course_module_lesson.repository";
import StudentCourseProgressFactory from "../factories/student_course_progress.factory";
import StudentCourseProgressRepository from "../repositories/student_course_progress.repository";
import StudentModuleProgressFactory from "../factories/student_module_progress.factory";
import StudentModuleProgressRepository from "../repositories/student_module_progress.repository";
import UserRepository from "../../userManagement/repositories/user.repository";
import MemberRepository from "../../memberManagement/repositories/member.repository";
import logger from "@shared/utils/logger";
import AppError from "@shared/error/app.error";
import { transaction } from "objection";
import { Course } from "../model/course.model";

interface CreateCoursePayload {
  courseTitle: string;
  description: Text;
  category: string;
  totalDuration: string;
  passingScore: number;
  courseModules: {
    moduleTitle: string;
    duration: string;
  }[];
  enrollmentType: string;
  mandatoryCourse?: boolean;
  campusId?: string;
}

interface AddCourseModules {
  courseModules: {
    moduleTitle: string;
    duration: string;
  }[];
}

interface AddCourseModuleLesson {
  courseModuleLessons: {
    lessonTitle: string;
    content: string;
    duration: string;
  }[];
}

@injectable()
class CourseService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly studentRepository: StudentRepository,
    private readonly courseModuleRepository: CourseModuleRepository,
    private readonly courseModuleLessonRepository: CourseModuleLessonRepository,
    private readonly studentCourseProgressRepository: StudentCourseProgressRepository,
    private readonly studentModuleProgressRepository: StudentModuleProgressRepository,
    private readonly userRepository: UserRepository,
    private readonly memberRepository: MemberRepository,
  ) {}

  async createCourse(data: CreateCoursePayload, superAdminId: string) {
    try {
      const superAdmin = await this.userRepository.findById(superAdminId);
      if (!superAdmin) throw new AppError(400, "Super admin does not exist");

      const { newCourse, newCourseModules } = await transaction(
        Course.knex(),
        async (trx) => {
          const course = CourseFactory.createCourse({
            courseTitle: data.courseTitle,
            description: data.description,
            category: data.category,
            totalDuration: data.totalDuration,
            passingScore: data.passingScore,
            enrollmentType: data.enrollmentType,
            mandatoryCourse: data.mandatoryCourse,
            modules: data.courseModules.length,
            churchId: String(superAdmin.churchId),
          });

          const newCourse = await this.courseRepository.save(course, trx);

          const courseModules = data.courseModules.map((module, index) =>
            CourseModuleFactory.addCourseModule({
              moduleTitle: module.moduleTitle,
              duration: module.duration,
              order: index + 1,
              courseId: newCourse.id,
            }),
          );

          const newCourseModules = await this.courseModuleRepository.saveBulk(
            courseModules,
            trx,
          );

          return { newCourse, newCourseModules };
        },
      );

      return {
        success: true,
        message: "Course and modules has been created successfully",
        course: newCourse,
        courseModules: newCourseModules,
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Error creating new course and modules",
      );
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while creating new course and modules",
      );
    }
  }

  async addCourseModules(data: AddCourseModules, courseId: string) {
    try {
      const course = await this.courseRepository.findById(courseId);
      if (!course) throw new AppError(400, "Course does not exist");

      const maxOrder = Number(course.modules);
      const startOrder = (maxOrder ?? 0) + 1;
      const courseModules = data.courseModules.map((module, index) =>
        CourseModuleFactory.addCourseModule({
          moduleTitle: module.moduleTitle,
          duration: module.duration,
          order: startOrder + index,
          courseId: course.id,
        }),
      );

      const newCourseModules = await this.courseModuleRepository.saveBulk(
        courseModules,
      );

      await this.courseRepository.updateById(course.id, {
        modules: Number(course.modules) + data.courseModules.length,
      });

      return {
        success: true,
        message: "New modules has been added to course successfully",
        courseModules: newCourseModules,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error adding course modules");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while adding course modules",
      );
    }
  }

  async addCourseModuleLessons(
    data: AddCourseModuleLesson,
    courseModuleId: string,
  ) {
    try {
      const courseModule = await this.courseModuleRepository.findById(
        courseModuleId,
      );
      if (!courseModule)
        throw new AppError(400, "Course module does not exist");

      const maxOrder = Number(courseModule.lessons);
      const startOrder = (maxOrder ?? 0) + 1;
      const courseModuleLessons = data.courseModuleLessons.map(
        (moduleLesson, index) =>
          CourseModuleLessonFactory.addCourseModuleLesson({
            lessonTitle: moduleLesson.lessonTitle,
            content: moduleLesson.content,
            duration: moduleLesson.duration,
            order: startOrder + index,
            moduleId: courseModule.id,
          }),
      );

      const newCourseModuleLessons =
        await this.courseModuleLessonRepository.saveBulk(courseModuleLessons);

      await this.courseModuleRepository.updateById(courseModule.id, {
        lessons: Number(courseModule.lessons) + data.courseModuleLessons.length,
      });

      return {
        success: true,
        message: "New lessons has been added to course module successfully",
        courseModuleLessons: newCourseModuleLessons,
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Error adding course module lessons",
      );
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while adding course module lessons",
      );
    }
  }

  async enrollToCourse(req: any) {
    try {
      const [member, admin, course] = await Promise.all([
        this.memberRepository.findById(req.user.id),
        this.userRepository.findById(req.user.id),
        this.courseRepository.findById(req.params.courseId),
      ]);
      if (!course) throw new AppError(400, "Course does not exist");

      let enrollingStudent;
      if (member || admin) {
        enrollingStudent = member || admin;
      }

      const student = StudentFactory.enrollStudent({
        studentName: `${enrollingStudent.firstName} ${enrollingStudent.lastName}`,
        role: "null",
        department: "null",
        memberId: enrollingStudent.id,
        courseId: course.id,
        churchId: String(enrollingStudent.churchId),
      });
      await this.studentRepository.save(student);

      await this.courseRepository.updateById(course.id, {
        enrolled: Number(course.enrolled) + 1,
      });

      return {
        success: true,
        message: "You have enrolled to the course successfully",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error enrolling new student");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while enrolling new student",
      );
    }
  }

  async startCourse(courseId: string, studentId: string) {
    try {
      const course = await this.courseRepository.findById(courseId);
      if (!course) throw new AppError(400, "Course does not exist");

      const student = await this.studentRepository.findOne({
        memberId: studentId,
        courseId: course.id,
      });
      if (!student) throw new AppError(400, "Student does not exist");

      const studentCourseProgress =
        StudentCourseProgressFactory.trackStudentCourseProgress({
          studentId: student.id,
          courseId: course.id,
          startedAt: new Date(),
        });

      await this.studentCourseProgressRepository.save(studentCourseProgress);

      return {
        success: true,
        message: `You have kick started the ${course.courseTitle} training course`,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error starting a new course");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while starting a new course",
      );
    }
  }

  async completeCourse(courseId: string, studentId: string) {
    try {
      const course = await this.courseRepository.findById(courseId);
      if (!course) throw new AppError(400, "Course does not exist");

      const student = await this.studentRepository.findOne({
        memberId: studentId,
        courseId: course.id,
      });
      if (!student) throw new AppError(400, "StudentModule does not exist");

      await this.studentCourseProgressRepository.findAndUpdate(
        { studentId: student.id, courseId: course.id },
        {
          status: "Completed",
          completedAt: new Date(),
        },
      );

      return {
        success: true,
        message: `Congratulations, you have completed the ${course.courseTitle} training course`,
      };
    } catch (error) {
      logger.error({
        error: "Error completing course",
      });
      throw new Error("An unexpected error occurred while completing course.");
    }
  }

  async startModule(moduleId: string, studentId: string) {
    try {
      const module = await this.courseModuleRepository.findById(moduleId);
      if (!module) throw new AppError(400, "Module does not exist");

      const student = await this.studentRepository.findOne({
        memberId: studentId,
        courseId: module.courseId,
      });
      if (!student) throw new AppError(400, "Student does not exist");

      const studentModuleProgress =
        StudentModuleProgressFactory.trackStudentModuleProgress({
          studentId: student.id,
          moduleId: module.id,
          startedAt: new Date(),
        });

      await this.studentModuleProgressRepository.save(studentModuleProgress);

      return {
        success: true,
        message: `You have kick started the ${module.moduleTitle} module`,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error starting a module");
      throw new AppError(
        400,
        error.message || "An unexpected error occurred while starting a module",
      );
    }
  }

  async completeModule(moduleId: string, studentId: string) {
    try {
      const module = await this.courseModuleRepository.findById(moduleId);
      if (!module) throw new AppError(400, "Module does not exist");

      const student = await this.studentRepository.findOne({
        memberId: studentId,
        courseId: module.courseId,
      });
      if (!student) throw new AppError(400, "Student does not exist");

      await this.studentModuleProgressRepository.findAndUpdate(
        { studentId: student.id, moduleId: module.id },
        {
          status: "Completed",
          completedAt: new Date(),
        },
      );

      return {
        success: true,
        message: `Congratulations, you have completed the ${module.moduleTitle} module`,
      };
    } catch (error) {
      logger.error({
        error: "Error completing module",
      });
      throw new Error("An unexpected error occurred while completing module.");
    }
  }

  async getCourseAndModules(req: any) {
    const courseId = req.params.courseId;
    const enrolledStudentId = req.user.id;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const course = await this.courseRepository.findById(courseId);
      if (!course) throw new AppError(400, "Course does not exist");

      const { data: courseModules, totalRecords } =
        await this.courseModuleRepository.findAndCountAll(
          { courseId: course.id },
          currentPage,
          pageSize,
        );

      if (courseModules.length === 0) {
        return {
          courseModules: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const enrolledStudent = await this.studentRepository.findOne({
        memberId: enrolledStudentId,
        courseId: course.id,
      });

      const enrolledStudents = await this.studentRepository.findAll({
        courseId: course.id,
      });

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        course,
        courseModules,
        enrolledStudents,
        isEnrolled: enrolledStudent?.isEnrolled,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching course and modules" });
      throw new Error(
        "An unexpected error occurred while fetching course and modules.",
      );
    }
  }

  async getAllChurchCourses(req: any) {
    const churchId = req.params.churchId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: churchCourses, totalRecords } =
        await this.courseRepository.findAndCountAll(
          { churchId },
          currentPage,
          pageSize,
        );

      if (churchCourses.length === 0) {
        return {
          churchCourses: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchCourses,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching all church courses" });
      throw new Error(
        "An unexpected error occurred while fetching all church courses.",
      );
    }
  }

  async getAllChurchMandatoryCourses(req: any) {
    const churchId = req.params.churchId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: churchMandatoryCourses, totalRecords } =
        await this.courseRepository.findAndCountAll(
          { churchId, mandatoryCourse: true },
          currentPage,
          pageSize,
        );

      if (churchMandatoryCourses.length === 0) {
        return {
          churchMandatoryCourses: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchMandatoryCourses,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching all church mandatory courses" });
      throw new Error(
        "An unexpected error occurred while fetching all church mandatory courses.",
      );
    }
  }

  async getCourseModuleLessons(req: any) {
    const moduleId = req.params.moduleId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: courseModuleLessons, totalRecords } =
        await this.courseModuleLessonRepository.findAndCountAll(
          { moduleId },
          currentPage,
          pageSize,
        );

      if (courseModuleLessons.length === 0) {
        return {
          courseModuleLessons: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        courseModuleLessons,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching course module lessons" });
      throw new Error(
        "An unexpected error occurred while fetching course module lessons.",
      );
    }
  }

  async editCourse(req: any) {
    try {
      const data = req.body;
      const course = await this.courseRepository.findById(req.params.courseId);
      if (!course) throw new AppError(400, "Course does not exist");

      await this.courseRepository.updateById(course.id, {
        courseTitle: data.courseTitle,
        description: data.description,
        category: data.category,
        totalDuration: data.totalDuration,
        passingScore: data.passingScore,
        enrollmentType: data.enrollmentType,
        mandatoryCourse: data.mandatoryCourse,
      });

      return {
        success: true,
        message: "Course info has been updated successfully",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to edit course");
      throw new AppError(400, error.message);
    }
  }

  async deleteCourse(courseId: string) {
    const course = await this.courseRepository.findById(courseId);
    if (!course) throw new AppError(400, "Course does not exist");

    await this.courseRepository.deleteById(course.id);

    return `${course.courseTitle} course has been deleted successfully`;
  }

  async editCourseModule(req: any) {
    try {
      const data = req.body;
      const courseModule = await this.courseModuleRepository.findById(
        req.params.courseModuleId,
      );
      if (!courseModule)
        throw new AppError(400, "Course module does not exist");

      await this.courseModuleRepository.updateById(courseModule.id, {
        moduleTitle: data.moduleTitle,
        duration: data.duration,
      });

      return {
        success: true,
        message: "Course module info has been updated successfully",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to edit course module");
      throw new AppError(400, error.message);
    }
  }

  async deleteCourseModule(courseModuleId: string) {
    try {
      const courseModule = await this.courseModuleRepository.findById(
        courseModuleId,
      );
      if (!courseModule)
        throw new AppError(400, "Course module does not exist");

      const course = await this.courseRepository.findById(
        courseModule.courseId,
      );
      if (!course) throw new AppError(400, "Course does not exist");

      const modulesToReorder =
        (await this.courseModuleRepository.findAllWithWhere(
          { courseId: course.id },
          { column: "order", order: "asc" },
        )) as any[];

      await this.courseModuleRepository.deleteById(courseModule.id);

      const modulesAfterDeleted = modulesToReorder.filter(
        (m) => m.order > courseModule.order,
      );

      for (const module of modulesAfterDeleted) {
        await this.courseModuleRepository.updateById(module.id, {
          order: module.order - 1,
        });
      }

      await this.courseRepository.updateById(courseModule.courseId, {
        modules: Number(course.modules) - 1,
      });

      return `${courseModule.moduleTitle} has been deleted successfully and remaining modules have been reordered`;
    } catch (error: any) {
      logger.error({ error: error.message }, "Error deleting course module");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while deleting course module",
      );
    }
  }
}

export default CourseService;
