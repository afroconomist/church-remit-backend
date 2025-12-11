import { ErrorResponse } from "@shared/utils/response.util";
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
      req.user.id
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
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
}

export default MemberController;
