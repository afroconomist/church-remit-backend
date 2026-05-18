import { SuccessResponse, ErrorResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import FacilityService from "../services/facility.service";
import httpStatus from "http-status";

@injectable()
class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  addNewFacility = async (req: Request, res: Response) => {
    const result: any = await this.facilityService.addNewFacility(
      req.body,
      req.user.id,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  bookFacility = async (req: Request, res: Response) => {
    const result: any = await this.facilityService.bookFacility(
      req.body,
      req.params.facilityId,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getFacilityBookings = async (req: Request, res: Response) => {
    try {
      const facilityBookings = await this.facilityService.getFacilityBookings(
        req,
      );
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", facilityBookings));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getAllChurchFacilities = async (req: Request, res: Response) => {
    try {
      const churchFacilities =
        await this.facilityService.getAllChurchFacilities(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchFacilities));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  changeFacilityStatus = async (req: Request, res: Response) => {
    try {
      const result: any = await this.facilityService.changeFacilityStatus(req);
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
        message: "Failed to put facility on maintenance status",
      });
    }
  };

  editFacility = async (req: Request, res: Response) => {
    try {
      const result: any = await this.facilityService.editFacility(req);
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
        .json({ status: false, message: "Failed to edit facility info" });
    }
  };
}

export default FacilityController;
