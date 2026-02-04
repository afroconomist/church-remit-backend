import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { addCampusRules } from "../validations/add-campus.validator";
import { assignPersonnelRules } from "../validations/assign-personnel.validator";
import { editCampusRules } from "../validations/edit-campus.validator";
import { validate } from "@shared/middlewares/validator.middleware";
import CampusController from "../controller/campus.controller";
import accessControlMiddleware from "@shared/middlewares/access-control.middleware";
import { AccessControls } from "../../accessControlManagement/enums/access-control.enum";
import authMiddleware from "@shared/middlewares/auth.middleware";

const campusController = container.resolve(CampusController);

const router = express.Router();

router.post(
  "/campuses/add",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.CAMPUS_ADDITION),
    validate(addCampusRules),
  ],
  (req: Request, res: Response, next) =>
    campusController.addCampus(req, res).catch((err) => next(err)),
);

router.get(
  "/campuses/:campusId/view",
  [authMiddleware, accessControlMiddleware(AccessControls.CAMPUS_LIST)],
  (req: Request, res: Response, next) =>
    campusController.getCampus(req, res).catch((err) => next(err)),
);

router.post(
  "/campuses/:campusId/assign-personnel",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.CAMPUS_MANAGEMENT),
    validate(assignPersonnelRules),
  ],
  (req: Request, res: Response, next) =>
    campusController
      .assignPersonnelToCampus(req, res)
      .catch((err) => next(err)),
);

router.get(
  "/:churchId/campuses",
  [authMiddleware, accessControlMiddleware(AccessControls.CAMPUS_LIST)],
  (req: Request, res: Response, next) =>
    campusController.getAllChurchCampuses(req, res).catch((err) => next(err)),
);

router.get(
  "/campuses/:campusId/personnels",
  [authMiddleware, accessControlMiddleware(AccessControls.CAMPUS_MANAGEMENT)],
  (req: Request, res: Response, next) =>
    campusController.getCampusPersonnels(req, res).catch((err) => next(err)),
);

router.put(
  "/campuses/:campusId/update",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.CAMPUS_UPDATE),
    validate(editCampusRules),
  ],
  (req: Request, res: Response, next) =>
    campusController.editCampus(req, res).catch((err) => next(err)),
);

router.delete(
  "/campuses/:campusId/delete",
  [authMiddleware, accessControlMiddleware(AccessControls.CAMPUS_MANAGEMENT)],
  (req: Request, res: Response, next) =>
    campusController.deleteCampus(req, res).catch((err) => next(err)),
);

export default router;
