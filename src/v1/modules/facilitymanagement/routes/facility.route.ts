import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { addNewFacilityRules } from "../validations/add-new-facility.validator";
import { bookFacilityRules } from "../validations/book-facility.validator";
import { editFacilityRules } from "../validations/edit-facility.validator";
import { validate } from "@shared/middlewares/validator.middleware";
import FacilityController from "../controller/facility.controller";
import accessControlMiddleware from "@shared/middlewares/access-control.middleware";
import { AccessControls } from "../../accessControlManagement/enums/access-control.enum";
import authMiddleware from "@shared/middlewares/auth.middleware";

const facilityController = container.resolve(FacilityController);

const router = express.Router();

router.post(
  "/facilities/add-new",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.FACILITY_ADDITION),
    validate(addNewFacilityRules),
  ],
  (req: Request, res: Response, next) =>
    facilityController.addNewFacility(req, res).catch((err) => next(err)),
);

router.post(
  "/facilities/:facilityId/book",
  [authMiddleware, validate(bookFacilityRules)],
  (req: Request, res: Response, next) =>
    facilityController.bookFacility(req, res).catch((err) => next(err)),
);

router.get(
  "/facilities/:facilityId/bookings",
  (req: Request, res: Response, next) =>
    facilityController.getFacilityBookings(req, res).catch((err) => next(err)),
);

router.get("/:churchId/facilities", (req: Request, res: Response, next) =>
  facilityController.getAllChurchFacilities(req, res).catch((err) => next(err)),
);

router.put(
  "/facilities/:facilityId/maintain",
  [authMiddleware, accessControlMiddleware(AccessControls.FACILITY_UPDATE)],
  (req: Request, res: Response, next) =>
    facilityController.changeFacilityStatus(req, res).catch((err) => next(err)),
);

router.put(
  "/facilities/:facilityId/update",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.FACILITY_BOOKING),
    validate(editFacilityRules),
  ],
  (req: Request, res: Response, next) =>
    facilityController.editFacility(req, res).catch((err) => next(err)),
);

export default router;
