import { ErrorResponse, SuccessResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import ChurchService from "../services/church.service";
import httpStatus from "http-status";

@injectable()
class ChurchController {
  constructor(private readonly churchService: ChurchService) {}

  registerChurchAndUser = async (req: Request, res: Response) => {
    const result: any = await this.churchService.createChurchAndUser(req.body);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getAll = async (_req: Request, res: Response) => {
    try {
      const churches = await this.churchService.getAllChurches();
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churches));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };
}

export default ChurchController;
