import { SuccessResponse, ErrorResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import CampusService from "../service/campus.service";
import httpStatus from "http-status";

@injectable()
class CampusController {
  constructor(private readonly campusService: CampusService) {}

  addCampus = async (req: Request, res: Response) => {
    const result: any = await this.campusService.addCampus(
      req.body,
      req.user.id,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  assignPersonnelToCampus = async (req: Request, res: Response) => {
    const result: any = await this.campusService.assignPersonnelToCampus(req);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getAllChurchCampuses = async (req: Request, res: Response) => {
    try {
      const churchCampuses = await this.campusService.getAllChurchCampuses(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchCampuses));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getCampusPersonnels = async (req: Request, res: Response) => {
    try {
      const campusPersonnels = await this.campusService.getCampusPersonnels(
        req,
      );
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", campusPersonnels));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  editCampus = async (req: Request, res: Response) => {
    try {
      const result: any = await this.campusService.editCampus(req);
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
        .json({ status: false, message: "Failed to edit campus info" });
    }
  };

  deleteCampus = async (req: Request, res: Response) => {
    const response = await this.campusService.deleteCampus(req.params.campusId);

    return res.status(httpStatus.OK).send(SuccessResponse(response));
  };
}

export default CampusController;
