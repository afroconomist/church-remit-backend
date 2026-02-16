import { SuccessResponse, ErrorResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import FamilyAndMemberService from "../services/family-and-member.service";
import httpStatus from "http-status";

@injectable()
class FamilyAndMemberController {
  constructor(
    private readonly familyAndMemberService: FamilyAndMemberService,
  ) {}

  createfamily = async (req: Request, res: Response) => {
    const result: any = await this.familyAndMemberService.createFamily(req);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getFamilies = async (req: Request, res: Response) => {
    try {
      const families = await this.familyAndMemberService.getFamilies(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", families));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  addFamilyMember = async (req: Request, res: Response) => {
    const result: any = await this.familyAndMemberService.addFamilyMember(req);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getUnlinkedMembers = async (req: Request, res: Response) => {
    try {
      const unlinkedMembers =
        await this.familyAndMemberService.getUnlinkedMembers(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", unlinkedMembers));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  linkToFamily = async (req: Request, res: Response) => {
    const result: any = await this.familyAndMemberService.linkToFamily(req);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getFamilyMembers = async (req: Request, res: Response) => {
    try {
      const familyMembers = await this.familyAndMemberService.getFamilyMembers(
        req,
      );
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", familyMembers));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  editFamilyMember = async (req: Request, res: Response) => {
    try {
      const result: any = await this.familyAndMemberService.editFamilyMember(
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
      return res
        .status(500)
        .json({ status: false, message: "Failed to edit family member" });
    }
  };

  editFamily = async (req: Request, res: Response) => {
    try {
      const result: any = await this.familyAndMemberService.editFamily(req);
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
        .json({ status: false, message: "Failed to edit family" });
    }
  };

  removeFamilyMember = async (req: Request, res: Response) => {
    const response = await this.familyAndMemberService.removeFamilyMember(req);

    return res.status(httpStatus.OK).send(SuccessResponse(response));
  };

  deleteFamily = async (req: Request, res: Response) => {
    const response = await this.familyAndMemberService.deleteFamily(req);

    return res.status(httpStatus.OK).send(SuccessResponse(response));
  };
}

export default FamilyAndMemberController;
