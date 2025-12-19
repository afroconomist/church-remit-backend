// import { SuccessResponse, ErrorResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import FamilyAndMemberService from "../services/family-and-member.service";
import httpStatus from "http-status";

@injectable()
class FamilyAndMemberController {
  constructor(
    private readonly familyAndMemberService: FamilyAndMemberService
  ) {}

  createfamily = async (req: Request, res: Response) => {
    const result: any = await this.familyAndMemberService.createFamily(
      req.body
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  addFamilyMember = async (req: Request, res: Response) => {
    const result: any = await this.familyAndMemberService.addFamilyMember(
      req.body,
      req.params.familyId
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };
}

export default FamilyAndMemberController;
