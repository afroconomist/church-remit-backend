import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { createChurchAndUserRules } from "../validations/create-church-and-user.validator";
import { validate } from "@shared/middlewares/validator.middleware";
import ChurchController from "../controller/church.controller";

const churchController = container.resolve(ChurchController);

const router = express.Router();

router.post(
  "/churches/register-church-and-user",
  [validate(createChurchAndUserRules)],
  (req: Request, res: Response, next) =>
    churchController.registerChurchAndUser(req, res).catch((err) => next(err))
);

// Add req: Request as the first parameter
router.get("/churches/", (req: Request, res: Response, next) => {
  churchController.getAll(req, res).catch((err) => next(err));
});

export default router;