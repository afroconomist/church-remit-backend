import express, { Request, Response } from "express";
import { container } from "tsyringe";
import DashboardController from "../controller/dashboard.controller";
import authMiddleware from "@shared/middlewares/auth.middleware";



const dashboardController = container.resolve(DashboardController);
const router = express.Router();


// router.post("/dashboard/update-profile", [authMiddleware, validate(profileUpdateRules)], (req: Request, res: Response) => {
//   dashboardController.updateProfile(req, res);
// });

router.get("/dashboard/profile", authMiddleware, (req: Request, res: Response) => {
  dashboardController.getProfile(req, res);
});

export default router;
