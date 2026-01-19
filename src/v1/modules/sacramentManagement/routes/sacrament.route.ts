import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { recordSacramentRules } from "../validations/record-sacrament.validator";
import { validate } from "@shared/middlewares/validator.middleware";
import SacramentController from "../controller/sacrament.controller";
import authMiddleware from "@shared/middlewares/auth.middleware";

const sacramentController = container.resolve(SacramentController);

const router = express.Router();

router.post(
  "/sacraments/record",
  [authMiddleware, validate(recordSacramentRules)],
  (req: Request, res: Response, next) =>
    sacramentController.recordSacrament(req, res).catch((err) => next(err)),
);

router.get(
  "/:churchId/sacraments",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    sacramentController.getChurchSacraments(req, res).catch((err) => next(err)),
);

export default router;
