import { SuccessResponse, ErrorResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import GroupService from "../services/group.service";
import httpStatus from "http-status";

@injectable()
class GroupController {
  constructor(private readonly groupService: GroupService) {}

  createGroup = async (req: Request, res: Response) => {
    const result: any = await this.groupService.createGroup(
      req.body,
      req.user.id,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  addMemberToGroup = async (req: Request, res: Response) => {
    const result: any = await this.groupService.addMemberToGroup(req);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  requestToOrJoinGroup = async (req: Request, res: Response) => {
    const result: any = await this.groupService.requestToOrJoinGroup(
      req.params.groupId,
      req.user.id,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  messageGroup = async (req: Request, res: Response) => {
    const result: any = await this.groupService.messageGroup(req);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getGroupMessages = async (req: Request, res: Response) => {
    const result: any = await this.groupService.getGroupMessages(req);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  recordAttendance = async (req: Request, res: Response) => {
    const result: any = await this.groupService.recordAttendance(
      req.body,
      req.params.groupId,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getAllChurchGroups = async (req: Request, res: Response) => {
    try {
      const churchGroups = await this.groupService.getAllChurchGroups(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchGroups));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getChurchGroupsBasedOnCategory = async (req: Request, res: Response) => {
    try {
      const churchGroupsBasedOnCategory =
        await this.groupService.getChurchGroupsBasedOnCategory(req);
      return res
        .status(httpStatus.OK)
        .send(
          SuccessResponse("Operation successful", churchGroupsBasedOnCategory),
        );
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getGroupProfile = async (req: Request, res: Response) => {
    const result: any = await this.groupService.getGroupProfile(req);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  approveNewMembers = async (req: Request, res: Response) => {
    try {
      const result: any = await this.groupService.approveNewMembers(
        req.params.newMemberId,
      );
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
        .json({ status: false, message: "Failed to approve new member" });
    }
  };

  assignGroupMemberToRole = async (req: Request, res: Response) => {
    try {
      const result: any = await this.groupService.assignGroupMemberToRole(
        req.params.groupMemberId,
        req.body.role,
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
        message: "Failed to assign member to new role",
      });
    }
  };

  editGroup = async (req: Request, res: Response) => {
    try {
      const result: any = await this.groupService.editGroup(req);
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
        .json({ status: false, message: "Failed to edit group info" });
    }
  };

  removeMemberFromGroup = async (req: Request, res: Response) => {
    const response = await this.groupService.removeMemberFromGroup(
      req.params.groupMemberId,
    );

    return res.status(httpStatus.OK).send(SuccessResponse(response));
  };

  deleteGroup = async (req: Request, res: Response) => {
    const response = await this.groupService.deleteGroup(req.params.groupId);

    return res.status(httpStatus.OK).send(SuccessResponse(response));
  };

  getGroupMembers = async (req: Request, res: Response) => {
    try {
      const groupMembers = await this.groupService.getGroupMembers(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", groupMembers));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getGroupMeetings = async (req: Request, res: Response) => {
    try {
      const groupMeetings = await this.groupService.getGroupMeetings(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", groupMeetings));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getGroupJoinRequests = async (req: Request, res: Response) => {
    try {
      const groupJoinRequests = await this.groupService.getGroupJoinRequests(
        req,
      );
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", groupJoinRequests));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };
}

export default GroupController;
