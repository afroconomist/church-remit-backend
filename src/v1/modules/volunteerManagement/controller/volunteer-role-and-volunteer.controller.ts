import { SuccessResponse, ErrorResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import VolunteerAndRoleService from "../services/volunteer-role-and-volunteer.service";
import httpStatus from "http-status";

@injectable()
class VolunteerAndRoleController {
  constructor(
    private readonly volunteerAndRoleService: VolunteerAndRoleService
  ) {}

  createVolunteerRoleAndShifts = async (req: Request, res: Response) => {
    const result: any =
      await this.volunteerAndRoleService.createVolunteerRoleAndShifts(
        req.body,
        req.user.id
      );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  addNewVolunteer = async (req: Request, res: Response) => {
    const result: any = await this.volunteerAndRoleService.addNewVolunteer(
      req.body,
      req.user.id
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getAllVolunteerRoles = async (req: Request, res: Response) => {
    try {
      const volunteerRoles =
        await this.volunteerAndRoleService.getAllVolunteerRoles(req);
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
      const volunteers = await this.volunteerAndRoleService.getAllVolunteers(
        req
      );
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
      const result: any =
        await this.volunteerAndRoleService.assignVolunteerToRole(req);
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
}

export default VolunteerAndRoleController;
