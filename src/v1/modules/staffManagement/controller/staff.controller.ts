import { SuccessResponse, ErrorResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import StaffService from "../services/staff.service";
import httpStatus from "http-status";

@injectable()
class StaffController {
  constructor(private readonly staffService: StaffService) {}

  getStaffMembers = async (req: Request, res: Response) => {
    try {
      const staffMembers = await this.staffService.getStaffMembers(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", staffMembers));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getPendingLeave = async (req: Request, res: Response) => {
    try {
      const pendingLeave = await this.staffService.getPendingLeave(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", pendingLeave));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };
}

export default StaffController;
