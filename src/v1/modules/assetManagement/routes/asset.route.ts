import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { addAssetRules } from "../validations/add-asset.validator";
import { updateAssetRules } from "../validations/update-asset.validator";
import { validate } from "@shared/middlewares/validator.middleware";
import AssetController from "../controller/asset.controller";
import accessControlMiddleware from "@shared/middlewares/access-control.middleware";
import { AccessControls } from "../../accessControlManagement/enums/access-control.enum";
import authMiddleware from "@shared/middlewares/auth.middleware";

const assetController = container.resolve(AssetController);

const router = express.Router();

router.post(
  "/assets/add",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.ASSET_ADDITION),
    validate(addAssetRules),
  ],
  (req: Request, res: Response, next) =>
    assetController.addAsset(req, res).catch((err) => next(err)),
);

router.get(
  "/:churchId/assets",
  [authMiddleware, accessControlMiddleware(AccessControls.ASSET_LIST)],
  (req: Request, res: Response, next) =>
    assetController.getAllChurchAssets(req, res).catch((err) => next(err)),
);

router.get(
  "/assets/:assetId/view",
  [authMiddleware, accessControlMiddleware(AccessControls.ASSET_LIST)],
  (req: Request, res: Response, next) =>
    assetController.getAsset(req, res).catch((err) => next(err)),
);

router.put(
  "/assets/:assetId/update",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.ASSET_UPDATE),
    validate(updateAssetRules),
  ],
  (req: Request, res: Response, next) =>
    assetController.updateAsset(req, res).catch((err) => next(err)),
);

router.delete(
  "/assets/:assetId/delete",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    assetController.deleteAsset(req, res).catch((err) => next(err)),
);

export default router;
