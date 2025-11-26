import { ErrorResponse, SuccessResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import ChurchService from "../services/church.service";
import httpStatus from "http-status";
// import logger from "@shared/utils/logger";

injectable()
class ChurchController {
  constructor(private readonly churchService: ChurchService) {}

  registerChurchAndUser = async (req: Request, res: Response) => {
    const result: any = await this.churchService.createChurchAndUser(req.body);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getAll = async (res: Response) => {
    try {
      const churches = await this.churchService.getAllChurches();
      res.send(SuccessResponse("Operation successful", churches));
    } catch (error: any) {
      res
        .status(500)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };
}

export default ChurchController;
