import { SuccessResponse, ErrorResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import LeaveService from "../services/leave.service";
import httpStatus from "http-status";

@injectable()
class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  submitLeaveRequest = async (req: Request, res: Response) => {
    const result: any = await this.leaveService.submitLeaveRequest(
      req.body,
      req.user.id
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  approveLeaveRequest = async (req: Request, res: Response) => {
    try {
      const result: any = await this.leaveService.approveLeaveRequest(req);
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
        message: "Failed to approve leave request",
      });
    }
  };

  rejectLeaveRequest = async (req: Request, res: Response) => {
    try {
      const result: any = await this.leaveService.rejectLeaveRequest(req);
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
        message: "Failed to reject leave request",
      });
    }
  };

  getLeavesBasedOnStatus = async (req: Request, res: Response) => {
    try {
      const leavesBasedOnStatus =
        await this.leaveService.getLeavesBasedOnStatus(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", leavesBasedOnStatus));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };
}

export default LeaveController;
