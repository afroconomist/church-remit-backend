import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { submitLeaveRequestRules } from "../validations/submit-leave-request.validator";
import { validate } from "@shared/middlewares/validator.middleware";
import LeaveController from "../controller/leave.controller";
import accessControlMiddleware from "@shared/middlewares/access-control.middleware";
import { AccessControls } from "../../accessControlManagement/enums/access-control.enum";
import authMiddleware from "@shared/middlewares/auth.middleware";

const leaveController = container.resolve(LeaveController);

const router = express.Router();

router.post(
  "/staff/leave/submit-request",
  [authMiddleware, validate(submitLeaveRequestRules)],
  (req: Request, res: Response, next) =>
    leaveController.submitLeaveRequest(req, res).catch((err) => next(err))
);

router.put(
  "/staff/leave/:leaveId/approve",
  [authMiddleware, accessControlMiddleware(AccessControls.APPROVE_LEAVE)],
  (req: Request, res: Response, next) =>
    leaveController.approveLeaveRequest(req, res).catch((err) => next(err))
);

router.put(
  "/staff/leave/:leaveId/reject",
  [authMiddleware, accessControlMiddleware(AccessControls.REJECT_LEAVE)],
  (req: Request, res: Response, next) =>
    leaveController.rejectLeaveRequest(req, res).catch((err) => next(err))
);

router.get(
  "/:churchId/staff/leave",
  [authMiddleware, accessControlMiddleware(AccessControls.VIEW_LEAVE_REQUESTS)],
  (req: Request, res: Response, next) =>
    leaveController.getLeavesBasedOnStatus(req, res).catch((err) => next(err))
);

export default router;
