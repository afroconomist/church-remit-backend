import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { createCourseRules } from "../validations/create-course.validator";
import { editCourseRules } from "../validations/edit-course.validator";
import { addCourseModuleRules } from "../validations/add-course-module.validator";
import { addCourseModuleLessonRules } from "../validations/add-course-module-lesson.validator";
import { editCourseModuleRules } from "../validations/edit-course-module.validator";
import { validate } from "@shared/middlewares/validator.middleware";
import CourseController from "../controller/course.controller";
import accessControlMiddleware from "@shared/middlewares/access-control.middleware";
import { AccessControls } from "../../accessControlManagement/enums/access-control.enum";
import authMiddleware from "@shared/middlewares/auth.middleware";

const courseController = container.resolve(CourseController);

const router = express.Router();

router.post(
  "/courses/create",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.COURSE_CREATION),
    validate(createCourseRules),
  ],
  (req: Request, res: Response, next) =>
    courseController.createCourse(req, res).catch((err) => next(err)),
);

router.post(
  "/courses/:courseId/add-modules",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.COURSE_CREATION),
    validate(addCourseModuleRules),
  ],
  (req: Request, res: Response, next) =>
    courseController.addCourseModules(req, res).catch((err) => next(err)),
);

router.post(
  "/course/:courseModuleId/add-lessons",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.COURSE_CREATION),
    validate(addCourseModuleLessonRules),
  ],
  (req: Request, res: Response, next) =>
    courseController.addCourseModuleLessons(req, res).catch((err) => next(err)),
);

router.post(
  "/courses/enroll",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    courseController.enrollStudent(req, res).catch((err) => next(err)),
);

router.post(
  "/courses/:courseId/start",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    courseController.startCourse(req, res).catch((err) => next(err)),
);

router.put(
  "/courses/:courseId/complete",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    courseController.completeCourse(req, res).catch((err) => next(err)),
);

router.post(
  "/course/:moduleId/start",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    courseController.startModule(req, res).catch((err) => next(err)),
);

router.put(
  "/course/:moduleId/complete",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    courseController.completeModule(req, res).catch((err) => next(err)),
);

router.get(
  "/courses/:courseId/info",
  [authMiddleware, accessControlMiddleware(AccessControls.COURSE_LIST)],
  (req: Request, res: Response, next) =>
    courseController.getCourse(req, res).catch((err) => next(err)),
);

router.get(
  "/:churchId/courses",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    courseController.getAllChurchCourses(req, res).catch((err) => next(err)),
);

router.get(
  "/:churchId/mandatory-courses",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    courseController
      .getAllChurchMandatoryCourses(req, res)
      .catch((err) => next(err)),
);

router.get(
  "/courses/:courseId/modules",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    courseController.getCourseModules(req, res).catch((err) => next(err)),
);

router.get(
  "/course/:moduleId/lessons",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    courseController.getCourseModuleLessons(req, res).catch((err) => next(err)),
);

router.put(
  "/courses/:courseId/update",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.COURSE_UPDATE),
    validate(editCourseRules),
  ],
  (req: Request, res: Response, next) =>
    courseController.editCourse(req, res).catch((err) => next(err)),
);

router.delete(
  "/courses/:courseId/delete",
  [authMiddleware, accessControlMiddleware(AccessControls.COURSE_DELETION)],
  (req: Request, res: Response, next) =>
    courseController.deleteCourse(req, res).catch((err) => next(err)),
);

router.put(
  "/course/:courseModuleId/update-module",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.COURSE_UPDATE),
    validate(editCourseModuleRules),
  ],
  (req: Request, res: Response, next) =>
    courseController.editCourseModule(req, res).catch((err) => next(err)),
);

router.delete(
  "/course/:courseModuleId/delete-module",
  [authMiddleware, accessControlMiddleware(AccessControls.COURSE_DELETION)],
  (req: Request, res: Response, next) =>
    courseController.deleteCourseModule(req, res).catch((err) => next(err)),
);

export default router;
