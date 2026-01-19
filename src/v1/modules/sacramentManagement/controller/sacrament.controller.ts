import { SuccessResponse, ErrorResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import SacramentService from "../services/sacrament.service";
import httpStatus from "http-status";

@injectable()
class SacramentController {
  constructor(private readonly sacramentService: SacramentService) {}

  recordSacrament = async (req: Request, res: Response) => {
    const result: any = await this.sacramentService.recordSacrament(
      req.body,
      req.user.id,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getChurchSacraments = async (req: Request, res: Response) => {
    try {
      const churchSacraments = await this.sacramentService.getChurchSacraments(
        req,
      );
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchSacraments));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };
}

export default SacramentController;
