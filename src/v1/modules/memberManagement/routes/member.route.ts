import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { addMemberRules } from "../validations/add-member.validator";
import { validate } from "@shared/middlewares/validator.middleware";
import { loginRules } from "../../userManagement/validations/login.validator";
import { getSingleUserRules } from "../../userManagement/validations/get-single-user.validator";
import MemberController from "../controller/member.controller";
import accessControlMiddleware from "@shared/middlewares/access-control.middleware";
import { AccessControls } from "../../accessControlManagement/enums/access-control.enum";
import authMiddleware from "@shared/middlewares/auth.middleware";

const memberController = container.resolve(MemberController);

const router = express.Router();

router.post(
  "/admin/add-member",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.USER_ONBOARDING),
    validate(addMemberRules),
  ],
  (req: Request, res: Response, next) =>
    memberController.addMember(req, res).catch((err) => next(err))
);

router.post(
  "/auth/login",
  validate(loginRules),
  (req: Request, res: Response) => {
    memberController.loginMember(req, res);
  }
);

router.get(
  "/admin/member/:id",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.USER_LIST),
    validate(getSingleUserRules),
  ],
  (req: Request, res: Response, next) => {
    memberController.getMemberProfile(req, res).catch((e) => next(e));
  }
);

export default router;
