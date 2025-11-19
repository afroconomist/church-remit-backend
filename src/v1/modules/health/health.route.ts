import express, { Response } from "express";
import { container } from "tsyringe";
import HealthController from "./health.controller";

const healthController = container.resolve(HealthController);
const router = express.Router();

router.get("/readyz", (res: Response) => {
  healthController.readinessCheck(res);
});

router.get("/livez", (res: Response) => {
  healthController.livelinessCheck(res);
});

export default router;
