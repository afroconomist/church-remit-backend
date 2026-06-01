import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { createFamilyRules } from "../validations/create-family.validator";
import { editFamilyMemberRules } from "../validations/edit-family-member.validator";
import { editFamilyRules } from "../validations/edit-family.validator";
import { addFamilyMemberRules } from "../validations/add-family-member.validator";
import { linkToFamilyRules } from "../validations/link-to-family.validator";
import { validate } from "@shared/middlewares/validator.middleware";
import FamilyController from "../controller/family.controller";
import accessControlMiddleware from "@shared/middlewares/access-control.middleware";
import { AccessControls } from "../../accessControlManagement/enums/access-control.enum";
import authMiddleware from "@shared/middlewares/auth.middleware";

const familyController = container.resolve(FamilyController);

const router = express.Router();

router.post(
  "/admin/create-family",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.FAMILY_CREATION),
    validate(createFamilyRules),
  ],
  (req: Request, res: Response, next) =>
    familyController.createfamily(req, res).catch((err) => next(err)),
);

router.get(
  "/admin/:churchId/families",
  [authMiddleware, accessControlMiddleware(AccessControls.VIEW_FAMILY)],
  (req: Request, res: Response, next) =>
    familyController.getFamilies(req, res).catch((err) => next(err)),
);

router.post(
  "/admin/family/:familyId/add-member",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.ADD_LINK_FAMILY_MEMBER),
    validate(addFamilyMemberRules),
  ],
  (req: Request, res: Response, next) =>
    familyController.addFamilyMember(req, res).catch((err) => next(err)),
);

router.get(
  "/admin/:churchId/unlinked-members",
  [authMiddleware, accessControlMiddleware(AccessControls.USER_LIST)],
  (req: Request, res: Response, next) =>
    familyController.getUnlinkedMembers(req, res).catch((err) => next(err)),
);

router.post(
  "/admin/family/:familyId/link-member",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.ADD_LINK_FAMILY_MEMBER),
    validate(linkToFamilyRules),
  ],
  (req: Request, res: Response, next) =>
    familyController.linkToFamily(req, res).catch((err) => next(err)),
);

router.get(
  "/admin/family/:familyId/members",
  [authMiddleware, accessControlMiddleware(AccessControls.VIEW_FAMILY)],
  (req: Request, res: Response, next) =>
    familyController.getFamilyMembers(req, res).catch((err) => next(err)),
);

router.put(
  "/admin/family/:memberId/edit-member",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.EDIT_FAMILY),
    validate(editFamilyMemberRules),
  ],
  (req: Request, res: Response, next) =>
    familyController.editFamilyMember(req, res).catch((err) => next(err)),
);

router.put(
  "/admin/family/:familyId/edit-family",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.EDIT_FAMILY),
    validate(editFamilyRules),
  ],
  (req: Request, res: Response, next) =>
    familyController.editFamily(req, res).catch((err) => next(err)),
);

router.delete(
  "/admin/family/:memberId/remove",
  [authMiddleware, accessControlMiddleware(AccessControls.REMOVE_FAMILY)],
  (req: Request, res: Response, next) => {
    familyController.removeFamilyMember(req, res).catch((e) => next(e));
  },
);

router.delete(
  "/admin/family/:familyId/delete",
  [authMiddleware, accessControlMiddleware(AccessControls.REMOVE_FAMILY)],
  (req: Request, res: Response, next) => {
    familyController.deleteFamily(req, res).catch((e) => next(e));
  },
);

export default router;
