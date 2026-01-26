import { SuccessResponse, ErrorResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import CourseService from "../services/course.service";
import httpStatus from "http-status";

@injectable()
class CourseController {
  constructor(private readonly courseService: CourseService) {}

  createCourse = async (req: Request, res: Response) => {
    const result: any = await this.courseService.createCourse(
      req.body,
      req.user.id,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  addCourseModules = async (req: Request, res: Response) => {
    const result: any = await this.courseService.addCourseModules(
      req.body,
      req.params.courseId,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  addCourseModuleLessons = async (req: Request, res: Response) => {
    const result: any = await this.courseService.addCourseModuleLessons(
      req.body,
      req.params.courseModuleId,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  enrollStudent = async (req: Request, res: Response) => {
    const result: any = await this.courseService.enrollStudent(req.user.id);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  startCourse = async (req: Request, res: Response) => {
    const result: any = await this.courseService.startCourse(
      req.params.courseId,
      req.user.id,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  completeCourse = async (req: Request, res: Response) => {
    const result: any = await this.courseService.completeCourse(
      req.params.courseId,
      req.user.id,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  startModule = async (req: Request, res: Response) => {
    const result: any = await this.courseService.startModule(
      req.params.moduleId,
      req.user.id,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  completeModule = async (req: Request, res: Response) => {
    const result: any = await this.courseService.completeModule(
      req.params.moduleId,
      req.user.id,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getAllChurchCourses = async (req: Request, res: Response) => {
    try {
      const churchCourses = await this.courseService.getAllChurchCourses(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchCourses));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getAllChurchMandatoryCourses = async (req: Request, res: Response) => {
    try {
      const churchMandatoryCourses =
        await this.courseService.getAllChurchMandatoryCourses(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchMandatoryCourses));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getCourseModules = async (req: Request, res: Response) => {
    try {
      const courseModules = await this.courseService.getCourseModules(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", courseModules));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  editCourse = async (req: Request, res: Response) => {
    try {
      const result: any = await this.courseService.editCourse(req);
      if (result.success) {
        return res.send(SuccessResponse(result.message));
      } else {
        return res
          .status(400)
          .json({ status: result.success, message: result.message });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ status: false, message: "Failed to edit course info" });
    }
  };

  deleteCourse = async (req: Request, res: Response) => {
    const response = await this.courseService.deleteCourse(req.params.courseId);

    return res.status(httpStatus.OK).send(SuccessResponse(response));
  };

  editCourseModule = async (req: Request, res: Response) => {
    try {
      const result: any = await this.courseService.editCourseModule(req);
      if (result.success) {
        return res.send(SuccessResponse(result.message));
      } else {
        return res
          .status(400)
          .json({ status: result.success, message: result.message });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ status: false, message: "Failed to edit course module info" });
    }
  };

  deleteCourseModule = async (req: Request, res: Response) => {
    const response = await this.courseService.deleteCourseModule(
      req.params.courseModuleId,
    );

    return res.status(httpStatus.OK).send(SuccessResponse(response));
  };
}

export default CourseController;
