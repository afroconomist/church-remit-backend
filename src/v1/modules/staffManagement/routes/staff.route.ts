import express, { Request, Response } from "express";
import { container } from "tsyringe";
import authMiddleware from "@shared/middlewares/auth.middleware";
import accessControlMiddleware from "@shared/middlewares/access-control.middleware";
import { AccessControls } from "../../accessControlManagement/enums/access-control.enum";
import StaffController from "../controller/staff.controller";

const staffController = container.resolve(StaffController);

const router = express.Router();

router.get(
  "/admin/:churchId/staff",
  [authMiddleware, accessControlMiddleware(AccessControls.VIEW_STAFF)],
  (req: Request, res: Response, next) =>
    staffController.getStaffMembers(req, res).catch((err) => next(err))
);

router.get(
  "/admin/:churchId/pending-leave",
  [authMiddleware, accessControlMiddleware(AccessControls.VIEW_LEAVE_REQUESTS)],
  (req: Request, res: Response, next) =>
    staffController.getPendingLeave(req, res).catch((err) => next(err))
);

export default router;
