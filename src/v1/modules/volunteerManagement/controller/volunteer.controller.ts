import { SuccessResponse, ErrorResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import VolunteerService from "../services/volunteer.service";
import httpStatus from "http-status";

@injectable()
class VolunteerController {
  constructor(private readonly volunteerService: VolunteerService) {}

  createVolunteerRole = async (req: Request, res: Response) => {
    const result: any = await this.volunteerService.createVolunteerRole(
      req.body,
      req.user.id,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  addNewVolunteer = async (req: Request, res: Response) => {
    const result: any = await this.volunteerService.addNewVolunteer(req);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getAllVolunteerRoles = async (req: Request, res: Response) => {
    try {
      const volunteerRoles = await this.volunteerService.getAllVolunteerRoles(
        req,
      );
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", volunteerRoles));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getAllVolunteers = async (req: Request, res: Response) => {
    try {
      const volunteers = await this.volunteerService.getAllVolunteers(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", volunteers));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  assignVolunteerToRole = async (req: Request, res: Response) => {
    try {
      const result: any = await this.volunteerService.assignVolunteerToRole(
        req,
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
        message: "Failed to assign volunteer to role",
      });
    }
  };

  removeVolunteerFromRole = async (req: Request, res: Response) => {
    try {
      const result: any = await this.volunteerService.removeVolunteerFromRole(
        req,
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
        message: "Failed to remove volunteer from role",
      });
    }
  };

  changeVolunteerStatus = async (req: Request, res: Response) => {
    const result: any = await this.volunteerService.changeVolunteerStatus(req);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };
}

export default VolunteerController;
