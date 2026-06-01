import { SuccessResponse, ErrorResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import PrayerService from "../services/prayer.service";
import httpStatus from "http-status";

@injectable()
class PrayerController {
  constructor(private readonly prayerService: PrayerService) {}

  submitPrayerRequest = async (req: Request, res: Response) => {
    const result: any = await this.prayerService.submitPrayerRequest(
      req.body,
      req.user.id,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  addPrayerWarrior = async (req: Request, res: Response) => {
    const result: any = await this.prayerService.addPrayerWarrior(req);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getAllPrayerRequests = async (req: Request, res: Response) => {
    try {
      const prayerRequests = await this.prayerService.getAllPrayerRequests(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", prayerRequests));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getPrayerWarriors = async (req: Request, res: Response) => {
    try {
      const prayerWarriors = await this.prayerService.getPrayerWarriors(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", prayerWarriors));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  assignPrayerToWarrior = async (req: Request, res: Response) => {
    try {
      const result: any = await this.prayerService.assignPrayerToWarrior(req);
      if (result.success) {
        return res.send(SuccessResponse(result.message));
      } else {
        return res
          .status(400)
          .json({ status: result.success, message: result.message });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to assign prayer to warrior",
      });
    }
  };

  getPrayerWarriorAssignments = async (req: Request, res: Response) => {
    try {
      const prayerWarriorAssignments =
        await this.prayerService.getPrayerWarriorAssignments(req);
      return res
        .status(httpStatus.OK)
        .send(
          SuccessResponse("Operation successful", prayerWarriorAssignments),
        );
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  markPrayerAnswered = async (req: Request, res: Response) => {
    try {
      const result: any = await this.prayerService.markPrayerAnswered(
        req.params.prayerRequestId,
      );
      if (result.success) {
        return res.send(SuccessResponse(result.message));
      } else {
        return res
          .status(400)
          .json({ status: result.success, message: result.message });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to mark prayer answered",
      });
    }
  };

  prayOnPrayerRequests = async (req: Request, res: Response) => {
    try {
      const result: any = await this.prayerService.prayOnPrayerRequests(
        req.params.prayerRequestId,
        req.user.id,
      );
      if (result.success) {
        return res.send(SuccessResponse(result.message));
      } else {
        return res
          .status(400)
          .json({ status: result.success, message: result.message });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to pray on prayer request",
      });
    }
  };

  commentOnPrayerRequest = async (req: Request, res: Response) => {
    const result: any = await this.prayerService.commentOnPrayerRequest(
      req.params.prayerRequestId,
      req.body.message,
      req.user.id,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getCommentsOnPrayerRequest = async (req: Request, res: Response) => {
    const result: any = await this.prayerService.getCommentsOnPrayerRequest(
      req,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  deleteCommentOnPrayerRequest = async (req: Request, res: Response) => {
    const response = await this.prayerService.deleteCommentOnPrayerRequest(
      req.params.commentId,
    );

    return res.status(httpStatus.OK).send(SuccessResponse(response));
  };

  createTestimony = async (req: Request, res: Response) => {
    const result: any = await this.prayerService.createTestimony(req);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getAllTestimonies = async (req: Request, res: Response) => {
    try {
      const testimonies = await this.prayerService.getAllTestimonies(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", testimonies));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };
}

export default PrayerController;
