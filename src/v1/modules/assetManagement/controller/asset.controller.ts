import { SuccessResponse, ErrorResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import AssetService from "../services/asset.service";
import httpStatus from "http-status";

@injectable()
class AssetController {
  constructor(private readonly assetService: AssetService) {}

  addAsset = async (req: Request, res: Response) => {
    try {
      const result: any = await this.assetService.addAsset(
        req.body,
        req.user.id,
      );
      return res
        .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
        .json(result);
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to add asset",
      });
    }
  };

  getAllChurchAssets = async (req: Request, res: Response) => {
    try {
      const churchAssets = await this.assetService.getAllChurchAssets(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchAssets));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getAsset = async (req: Request, res: Response) => {
    const result: any = await this.assetService.getAsset(req.params.assetId);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  updateAsset = async (req: Request, res: Response) => {
    try {
      const result: any = await this.assetService.updateAsset(req);
      return res
        .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
        .json(result);
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update asset",
      });
    }
  };

  deleteAsset = async (req: Request, res: Response) => {
    const response = await this.assetService.deleteAsset(req.params.assetId);

    return res.status(httpStatus.OK).send(SuccessResponse(response));
  };
}

export default AssetController;
