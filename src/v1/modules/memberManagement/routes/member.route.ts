import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { addMemberRules } from "../validations/add-member.validator";
import { uploadBulkMembersRules } from "../validations/create-bulk-members.validator";
import { updateMemberRules } from "../validations/update-member.validator";
import {
  validate,
  validateArray,
} from "@shared/middlewares/validator.middleware";
import { loginRules } from "../../userManagement/validations/login.validator";
import { changePasswordRules } from "../validations/change-password.validator";
import { profilePictureUploadRules } from "../../userManagement/validations/profile-picture.validator";
import { deleteReasonRules } from "../../userManagement/validations/delete-reason.validator";
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
  "/admin/upload-bulk-members",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.BULK_USER_ONBOARDING),
    validateArray(uploadBulkMembersRules),
  ],
  (req: Request, res: Response) => memberController.uploadBulkMembers(req, res)
);

router.post(
  "/members/login",
  validate(loginRules),
  (req: Request, res: Response, next) => {
    memberController.loginMember(req, res).catch((err) => next(err));
  }
);

router.post(
  "/members/change-password",
  validate(changePasswordRules),
  (req: Request, res: Response, next) => {
    memberController.createPassword(req, res).catch((err) => next(err));
  }
);

router.get(
  "/members/profile",
  [
    authMiddleware,
    // accessControlMiddleware(AccessControls.USER_LIST),
  ],
  (req: Request, res: Response, next) => {
    memberController.getMemberProfile(req, res).catch((e) => next(e));
  }
);

router.put(
  "/members/:id/update",
  [
    authMiddleware,
    // accessControlMiddleware(AccessControls.USER_PROFILE_UPDATE),
    validate(updateMemberRules),
  ],
  (req: Request, res: Response, next) => {
    memberController.updateMember(req, res).catch((err) => next(err));
  }
);

router.put(
  "/members/:id/upload-dp",
  [
    authMiddleware,
    // accessControlMiddleware(AccessControls.USER_PROFILE_UPDATE),
    validate(profilePictureUploadRules),
  ],
  (req: Request, res: Response, next) => {
    memberController
      .uploadMemberProfilePicture(req, res)
      .catch((err) => next(err));
  }
);

router.get(
  "/admin/member/:id/view-info",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.USER_LIST),
    validate(getSingleUserRules),
  ],
  (req: Request, res: Response, next) => {
    memberController.getMember(req, res).catch((e) => next(e));
  }
);

router.delete(
  "/admin/member/:id/remove",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.USER_LIST),
    validate(deleteReasonRules),
  ],
  (req: Request, res: Response, next) => {
    memberController.deleteMember(req, res).catch((e) => next(e));
  }
);

export default router;
