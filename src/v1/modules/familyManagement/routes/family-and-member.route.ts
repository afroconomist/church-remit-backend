import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { createFamilyRules } from "../validations/create-family.validation";
import { addFamilyMemberRules } from "../validations/add-family-member.validator";
import { validate } from "@shared/middlewares/validator.middleware";
import FamilyAndMemberController from "../controller/family-and-member.controller";
import accessControlMiddleware from "@shared/middlewares/access-control.middleware";
import { AccessControls } from "../../accessControlManagement/enums/access-control.enum";
import authMiddleware from "@shared/middlewares/auth.middleware";

const familyAndMemberController = container.resolve(FamilyAndMemberController);

const router = express.Router();

router.post(
  "/admin/create-family",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.FAMILY_CREATION),
    validate(createFamilyRules),
  ],
  (req: Request, res: Response, next) =>
    familyAndMemberController.createfamily(req, res).catch((err) => next(err))
);

router.post(
  "/admin/family/:familyId/add-member",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.ADD_LINK_FAMILY_MEMBER),
    validate(addFamilyMemberRules),
  ],
  (req: Request, res: Response, next) =>
    familyAndMemberController
      .addFamilyMember(req, res)
      .catch((err) => next(err))
);

export default router;
