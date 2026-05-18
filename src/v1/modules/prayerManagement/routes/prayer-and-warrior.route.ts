import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { submitPrayerRequestRules } from "../validations/submit-prayer-request.validator";
import { addCommentOnPrayerRequestRules } from "../validations/add-comment-on-prayer-request.validator";
import { createTestimonyRules } from "../validations/create-testimony.validator";
import { addPrayerWarriorRules } from "../validations/add-prayer-warrior.validator";
import { assignPrayerToWarriorRules } from "../validations/assign-prayer-to-warrior.validator";
import { validate } from "@shared/middlewares/validator.middleware";
import PrayerAndWarriorController from "../controller/prayer-and-warrior.controller";
import accessControlMiddleware from "@shared/middlewares/access-control.middleware";
import { AccessControls } from "../../accessControlManagement/enums/access-control.enum";
import authMiddleware from "@shared/middlewares/auth.middleware";

const prayerAndWarriorController = container.resolve(
  PrayerAndWarriorController
);

const router = express.Router();

router.post(
  "/prayer/submit",
  [authMiddleware, validate(submitPrayerRequestRules)],
  (req: Request, res: Response, next) =>
    prayerAndWarriorController
      .submitPrayerRequest(req, res)
      .catch((err) => next(err))
);

router.post(
  "/prayer/warriors/add",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.PRAYER_WARRIOR_CREATION),
    validate(addPrayerWarriorRules),
  ],
  (req: Request, res: Response, next) =>
    prayerAndWarriorController
      .addPrayerWarrior(req, res)
      .catch((err) => next(err))
);

router.get(
  "/admin/:churchId/prayer/requests",
  [authMiddleware, accessControlMiddleware(AccessControls.PRAYER_REQUEST_LIST)],
  (req: Request, res: Response, next) =>
    prayerAndWarriorController
      .getAllPrayerRequests(req, res)
      .catch((err) => next(err))
);

router.get(
  "/admin/:churchId/prayer/warriors",
  [authMiddleware, accessControlMiddleware(AccessControls.PRAYER_WARRIOR_LIST)],
  (req: Request, res: Response, next) =>
    prayerAndWarriorController
      .getPrayerWarriors(req, res)
      .catch((err) => next(err))
);

router.put(
  "/prayer/assign",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.PRAYER_ASSIGNMENT),
    validate(assignPrayerToWarriorRules),
  ],
  (req: Request, res: Response, next) =>
    prayerAndWarriorController
      .assignPrayerToWarrior(req, res)
      .catch((err) => next(err))
);

router.get(
  "/prayer/warriors/:prayerWarriorId/assignments",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.PRAYER_ASSIGNMENT_LIST),
  ],
  (req: Request, res: Response, next) =>
    prayerAndWarriorController
      .getPrayerWarriorAssignments(req, res)
      .catch((err) => next(err))
);

router.put(
  "/prayer/:prayerRequestId/mark-answered",
  [authMiddleware, accessControlMiddleware(AccessControls.PRAYER_ANSWERED)],
  (req: Request, res: Response, next) =>
    prayerAndWarriorController
      .markPrayerAnswered(req, res)
      .catch((err) => next(err))
);

router.put(
  "/prayer/:prayerRequestId/pray",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    prayerAndWarriorController
      .prayOnPrayerRequests(req, res)
      .catch((err) => next(err))
);

router.post(
  "/prayer/:prayerRequestId/comment",
  [authMiddleware, validate(addCommentOnPrayerRequestRules)],
  (req: Request, res: Response, next) =>
    prayerAndWarriorController
      .commentOnPrayerRequest(req, res)
      .catch((err) => next(err))
);

router.get(
  "/prayer/:prayerRequestId/comments",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    prayerAndWarriorController
      .getCommentsOnPrayerRequest(req, res)
      .catch((err) => next(err))
);

router.delete(
  "/prayer/requests/comments/:commentId/delete",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    prayerAndWarriorController
      .deleteCommentOnPrayerRequest(req, res)
      .catch((err) => next(err))
);

router.post(
  "/testimonies/create",
  [authMiddleware, validate(createTestimonyRules)],
  (req: Request, res: Response, next) =>
    prayerAndWarriorController
      .createTestimony(req, res)
      .catch((err) => next(err))
);

export default router;
