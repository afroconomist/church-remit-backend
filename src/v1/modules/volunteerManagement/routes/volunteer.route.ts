import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { createVolunteerRoleRules } from "../validations/create-volunteer-role.validator";
import { addNewVolunteerRules } from "../validations/add-new-volunteer.validator";
import { assignVolunteerToRoleRules } from "../validations/assign-volunteer-to-role.validator";
import { changeVolunteerStatusRules } from "../validations/change-volunteer-status.validator";
import { validate } from "@shared/middlewares/validator.middleware";
import accessControlMiddleware from "@shared/middlewares/access-control.middleware";
import { AccessControls } from "../../accessControlManagement/enums/access-control.enum";
import authMiddleware from "@shared/middlewares/auth.middleware";
import VolunteerController from "../controller/volunteer.controller";

const volunteerController = container.resolve(VolunteerController);

const router = express.Router();

router.post(
  "/volunteers/new-role",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.VOLUNTEER_ROLE_CREATION),
    validate(createVolunteerRoleRules),
  ],
  (req: Request, res: Response, next) =>
    volunteerController.createVolunteerRole(req, res).catch((err) => next(err)),
);

router.post(
  "/volunteers/new-volunteer",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.VOLUNTEER_ADDITION),
    validate(addNewVolunteerRules),
  ],
  (req: Request, res: Response, next) =>
    volunteerController.addNewVolunteer(req, res).catch((err) => next(err)),
);

router.get(
  "/volunteers/:churchId/roles",
  [authMiddleware, accessControlMiddleware(AccessControls.VOLUNTEER_ROLES)],
  (req: Request, res: Response, next) =>
    volunteerController
      .getAllVolunteerRoles(req, res)
      .catch((err) => next(err)),
);

router.get(
  "/volunteers/:churchId/",
  [authMiddleware, accessControlMiddleware(AccessControls.VOLUNTEER_LIST)],
  (req: Request, res: Response, next) =>
    volunteerController.getAllVolunteers(req, res).catch((err) => next(err)),
);

router.put(
  "/volunteers/:volunteerId/assign-role",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.VOLUNTEER_ASSIGNMENT),
    validate(assignVolunteerToRoleRules),
  ],
  (req: Request, res: Response, next) => {
    volunteerController.assignVolunteerToRole(req, res).catch((e) => next(e));
  },
);

router.delete(
  "/volunteers/:volunteerId/remove-role",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.VOLUNTEER_ASSIGNMENT),
  ],
  (req: Request, res: Response, next) => {
    volunteerController.removeVolunteerFromRole(req, res).catch((e) => next(e));
  },
);

router.patch(
  "/volunteers/:volunteerId/change-status",
  [authMiddleware, validate(changeVolunteerStatusRules)],
  (req: Request, res: Response, next) => {
    volunteerController.changeVolunteerStatus(req, res).catch((e) => next(e));
  },
);

export default router;
