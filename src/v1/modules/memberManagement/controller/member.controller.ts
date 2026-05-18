import { SuccessResponse, ErrorResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import MemberService from "../services/member.service";
import httpStatus from "http-status";

@injectable()
class MemberController {
  constructor(private readonly memberService: MemberService) {}

  addMember = async (req: Request, res: Response) => {
    const result: any = await this.memberService.addMember(
      req.body,
      req.user.id,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  assignRoleToMember = async (req: Request, res: Response) => {
    try {
      const result: any = await this.memberService.assignRoleToMember(req);
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
        message: "Failed to assign role to member",
      });
    }
  };

  uploadBulkMembers = async (req: Request, res: Response) => {
    const result: any = await this.memberService.uploadBulkMembers(req);
    if (result.success) {
      return res.status(200).json({
        status: result.success,
        message: result.message,
        data: result.data,
      });
    } else {
      return res
        .status(400)
        .json({ status: result.success, message: result.message });
    }
  };

  loginMember = async (req: Request, res) => {
    try {
      const result: any = await this.memberService.loginMember(req.body);
      return res
        .status(result.status ? httpStatus.OK : httpStatus.BAD_REQUEST)
        .json(result);
    } catch (error: any) {
      res.status(500).json(ErrorResponse("Internal Server: ", error));
    }
  };

  createPassword = async (req: Request, res) => {
    try {
      const result: any = await this.memberService.changePasswordOnFirstLogin(
        req.body,
      );
      if (result.success) {
        return res.send(SuccessResponse(result.message, result.data));
      } else {
        return res
          .status(400)
          .json({ status: result.success, message: result.message });
      }
    } catch (error: any) {
      res.status(500).json(ErrorResponse("Internal Server: ", error));
    }
  };

  getMemberProfile = async (req: Request, res: Response) => {
    const result: any = await this.memberService.getMemberProfile(req);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  updateMember = async (req: Request, res: Response) => {
    try {
      const result: any = await this.memberService.updateMember(req);
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
        .json({ status: false, message: "Failed to update member account" });
    }
  };

  uploadMemberProfilePicture = async (req: Request, res: Response) => {
    try {
      const result: any = await this.memberService.uploadMemberProfilePicture(
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
        message: "Failed to update member profile picture",
      });
    }
  };

  getMember = async (req: Request, res: Response) => {
    const response = await this.memberService.getMember(req.params.id);

    return res
      .status(httpStatus.OK)
      .send(SuccessResponse("Operation successful", response));
  };

  deleteMember = async (req: Request, res: Response) => {
    const response = await this.memberService.deleteMember(req);

    return res.status(httpStatus.OK).send(SuccessResponse(response));
  };

  createMemberCategory = async (req: Request, res: Response) => {
    const result: any = await this.memberService.createMemberCategory(
      req.body,
      req.user.id,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getChurchMemberCategories = async (req: Request, res: Response) => {
    try {
      const memberCategories =
        await this.memberService.getChurchMemberCategories(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", memberCategories));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  editMemberCategory = async (req: Request, res: Response) => {
    try {
      const result: any = await this.memberService.editMemberCategory(req);
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
        .json({ status: false, message: "Failed to update member category" });
    }
  };

  deleteMemberCategory = async (req: Request, res: Response) => {
    const response = await this.memberService.deleteMemberCategory(
      req.params.categoryId,
    );

    return res.status(httpStatus.OK).send(SuccessResponse(response));
  };

  getChurchUpcomingMembersBirthdays = async (req: Request, res: Response) => {
    try {
      const membersBirthdays =
        await this.memberService.getChurchUpcomingMembersBirthdays(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", membersBirthdays));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getMemberFamily = async (req: Request, res: Response) => {
    try {
      const familyMembers = await this.memberService.getMemberFamily(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", familyMembers));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getMemberCelebrations = async (req: Request, res: Response) => {
    try {
      const memberBirthday = await this.memberService.getMemberCelebrations(
        req,
      );
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", memberBirthday));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  sendBirthdayMessage = async (req: Request, res: Response) => {
    const response = await this.memberService.sendBirthdayMessage(req);
    return res.status(httpStatus.OK).send(SuccessResponse(response.message));
  };
}

export default MemberController;
