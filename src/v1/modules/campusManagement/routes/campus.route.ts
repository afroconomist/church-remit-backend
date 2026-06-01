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

router.get(
  "/campuses/:campusId/assets",
  [authMiddleware, accessControlMiddleware(AccessControls.CAMPUS_LIST)],
  (req: Request, res: Response, next) =>
    campusController.getAllCampusAssets(req, res).catch((err) => next(err)),
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

router.get(
  "/campus/members",
  [authMiddleware, accessControlMiddleware(AccessControls.USER_LIST)],
  (req: Request, res: Response, next) =>
    campusController.getCampusChurchMembers(req, res).catch((err) => next(err)),
);

router.get(
  "/campus/upcoming-birthdays",
  [authMiddleware, accessControlMiddleware(AccessControls.USER_LIST)],
  (req: Request, res: Response, next) =>
    campusController
      .getCampusChurchUpcomingMembersBirthdays(req, res)
      .catch((err) => next(err)),
);

router.get(
  "/campus/families",
  [authMiddleware, accessControlMiddleware(AccessControls.FAMILY_LIST)],
  (req: Request, res: Response, next) =>
    campusController.getCampusFamilies(req, res).catch((err) => next(err)),
);

router.get(
  "/campus/volunteer-roles",
  [authMiddleware, accessControlMiddleware(AccessControls.VOLUNTEER_ROLES)],
  (req: Request, res: Response, next) =>
    campusController
      .getCampusVolunteerRoles(req, res)
      .catch((err) => next(err)),
);

router.get(
  "/campus/volunteers",
  [authMiddleware, accessControlMiddleware(AccessControls.VOLUNTEER_LIST)],
  (req: Request, res: Response, next) =>
    campusController.getCampusVolunteers(req, res).catch((err) => next(err)),
);

router.get(
  "/campus/church-events",
  [authMiddleware, accessControlMiddleware(AccessControls.EVENT_LIST)],
  (req: Request, res: Response, next) =>
    campusController.getCampusChurchEvents(req, res).catch((err) => next(err)),
);

router.get(
  "/campus/upcoming-events",
  [authMiddleware, accessControlMiddleware(AccessControls.EVENT_LIST)],
  (req: Request, res: Response, next) =>
    campusController
      .getCampusUpcomingChurchEvents(req, res)
      .catch((err) => next(err)),
);

router.get(
  "/campus/recurring-events",
  [authMiddleware, accessControlMiddleware(AccessControls.EVENT_LIST)],
  (req: Request, res: Response, next) =>
    campusController
      .getCampusRecurringChurchEvents(req, res)
      .catch((err) => next(err)),
);

router.get(
  "/campus/past-events",
  [authMiddleware, accessControlMiddleware(AccessControls.EVENT_LIST)],
  (req: Request, res: Response, next) =>
    campusController.getPastChurchEvents(req, res).catch((err) => next(err)),
);

router.get(
  "/campus/members-sacraments",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    campusController.getCampusSacraments(req, res).catch((err) => next(err)),
);

router.get(
  "/campus/prayer-requests",
  [authMiddleware, accessControlMiddleware(AccessControls.PRAYER_REQUEST_LIST)],
  (req: Request, res: Response, next) =>
    campusController
      .getCampusPrayerRequests(req, res)
      .catch((err) => next(err)),
);

router.get(
  "/campus/prayer-warriors",
  [authMiddleware, accessControlMiddleware(AccessControls.PRAYER_WARRIOR_LIST)],
  (req: Request, res: Response, next) =>
    campusController
      .getCampusPrayerWarriors(req, res)
      .catch((err) => next(err)),
);

router.get(
  "/campus/news",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    campusController.getCampusNews(req, res).catch((err) => next(err)),
);

router.get(
  "/campus/newsletters",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    campusController.getCampusNewsletters(req, res).catch((err) => next(err)),
);

router.get(
  "/campus/circulars",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    campusController.getCampusCirculars(req, res).catch((err) => next(err)),
);

router.get(
  "/campus/discussion-boards",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    campusController
      .getCampusDiscussionBoards(req, res)
      .catch((err) => next(err)),
);

router.get(
  "/campus/announcements",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    campusController.getCampusAnnouncements(req, res).catch((err) => next(err)),
);

router.get(
  "/campus/assets",
  [authMiddleware, accessControlMiddleware(AccessControls.ASSET_LIST)],
  (req: Request, res: Response, next) =>
    campusController.getCampusAssets(req, res).catch((err) => next(err)),
);

router.get(
  "/campus/facilities",
  [authMiddleware, accessControlMiddleware(AccessControls.FACILITY_LIST)],
  (req: Request, res: Response, next) =>
    campusController.getCampusFacilities(req, res).catch((err) => next(err)),
);

router.get(
  "/campus/documents",
  [authMiddleware, accessControlMiddleware(AccessControls.DOCUMENT_LIST)],
  (req: Request, res: Response, next) =>
    campusController.getCampusDocuments(req, res).catch((err) => next(err)),
);

router.get(
  "/campus/info",
  [authMiddleware, accessControlMiddleware(AccessControls.CAMPUS_LIST)],
  (req: Request, res: Response, next) =>
    campusController.getCampusDetails(req, res).catch((err) => next(err)),
);

// routes for form dropdowns
router.get(
  "/dropdowns/:churchId/campuses",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    campusController
      .getAllChurchCampusesForDropdown(req, res)
      .catch((err) => next(err)),
);

export default router;
