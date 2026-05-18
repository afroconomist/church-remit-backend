import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { createNewEventRules } from "../validations/create-new-event.validator";
import { addAgendaRules } from "../validations/add-agenda.validator";
import { submitReviewRules } from "../validations/submit-review.validator";
import { editEventRules } from "../validations/edit-event.validator";
import { editAgendaRules } from "../validations/edit-agenda.validator";
import {
  createEventBudgetRules,
  editEventBudgetRules,
} from "../validations/event-budget.validator";
import { validate } from "@shared/middlewares/validator.middleware";
import EventController from "../controller/event.controller";
import accessControlMiddleware from "@shared/middlewares/access-control.middleware";
import { AccessControls } from "../../accessControlManagement/enums/access-control.enum";
import authMiddleware from "@shared/middlewares/auth.middleware";

const eventController = container.resolve(EventController);

const router = express.Router();

router.post(
  "/events/create",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.EVENT_CREATION),
    validate(createNewEventRules),
  ],
  (req: Request, res: Response, next) =>
    eventController.createNewEvent(req, res).catch((err) => next(err)),
);

router.post(
  "/events/:eventId/add-agenda",
  [authMiddleware, validate(addAgendaRules)],
  (req: Request, res: Response, next) =>
    eventController.addAgenda(req, res).catch((err) => next(err)),
);

router.post(
  "/events/:eventId/register",
  [authMiddleware],
  (req: Request, res: Response, next) =>
    eventController.registerForEvent(req, res).catch((err) => next(err)),
);

router.put(
  "/events/:attendeeId/approve",
  [authMiddleware, accessControlMiddleware(AccessControls.EVENT_REGISTRATION)],
  (req: Request, res: Response, next) =>
    eventController
      .approveRegisteredAttendees(req, res)
      .catch((err) => next(err)),
);

router.post(
  "/events/:eventId/submit-review",
  [authMiddleware, validate(submitReviewRules)],
  (req: Request, res: Response, next) =>
    eventController.submitEventReview(req, res).catch((err) => next(err)),
);

router.get(
  "/events/:eventId/reviews",
  [authMiddleware, accessControlMiddleware(AccessControls.EVENT_LIST)],
  (req: Request, res: Response, next) =>
    eventController.getEventReviews(req, res).catch((err) => next(err)),
);

router.get(
  "/:churchId/events",
  [authMiddleware, accessControlMiddleware(AccessControls.EVENT_LIST)],
  (req: Request, res: Response, next) =>
    eventController.getAllChurchEvents(req, res).catch((err) => next(err)),
);

router.get(
  "/:churchId/events/upcoming",
  [authMiddleware, accessControlMiddleware(AccessControls.EVENT_LIST)],
  (req: Request, res: Response, next) =>
    eventController.getUpcomingChurchEvents(req, res).catch((err) => next(err)),
);

router.get(
  "/:churchId/events/recurring",
  [authMiddleware, accessControlMiddleware(AccessControls.EVENT_LIST)],
  (req: Request, res: Response, next) =>
    eventController
      .getRecurringChurchEvents(req, res)
      .catch((err) => next(err)),
);

router.get(
  "/:churchId/events/past",
  [authMiddleware, accessControlMiddleware(AccessControls.EVENT_LIST)],
  (req: Request, res: Response, next) =>
    eventController.getPastChurchEvents(req, res).catch((err) => next(err)),
);

router.get(
  "/events/:eventId/agendas",
  [authMiddleware, accessControlMiddleware(AccessControls.EVENT_LIST)],
  (req: Request, res: Response, next) =>
    eventController.getEventAgendas(req, res).catch((err) => next(err)),
);

router.get(
  "/events/:eventId/volunteers",
  [authMiddleware, accessControlMiddleware(AccessControls.EVENT_LIST)],
  (req: Request, res: Response, next) =>
    eventController.getEventVolunteers(req, res).catch((err) => next(err)),
);

router.put(
  "/events/:attendeeId/check-in",
  [authMiddleware, accessControlMiddleware(AccessControls.EVENT_REGISTRATION)],
  (req: Request, res: Response, next) =>
    eventController.checkInAttendees(req, res).catch((err) => next(err)),
);

router.put(
  "/events/:eventId/edit",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.EVENT_UPDATE),
    validate(editEventRules),
  ],
  (req: Request, res: Response, next) =>
    eventController.editEvent(req, res).catch((err) => next(err)),
);

router.delete(
  "/events/:eventId/delete",
  [authMiddleware, accessControlMiddleware(AccessControls.EVENT_DELETION)],
  (req: Request, res: Response, next) =>
    eventController.deleteEvent(req, res).catch((err) => next(err)),
);

router.put(
  "/events/:agendaId/edit-agenda",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.EVENT_UPDATE),
    validate(editAgendaRules),
  ],
  (req: Request, res: Response, next) =>
    eventController.editAgenda(req, res).catch((err) => next(err)),
);

router.delete(
  "/events/:agendaId/delete-agenda",
  [authMiddleware, accessControlMiddleware(AccessControls.EVENT_DELETION)],
  (req: Request, res: Response, next) =>
    eventController.deleteAgenda(req, res).catch((err) => next(err)),
);

router.get(
  "/events/:eventId/info",
  [authMiddleware, accessControlMiddleware(AccessControls.EVENT_LIST)],
  (req: Request, res: Response, next) =>
    eventController.getEventAndAttendees(req, res).catch((err) => next(err)),
);

router.post(
  "/events/:eventId/create-budget",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.EVENT_CREATION),
    validate(createEventBudgetRules),
  ],
  (req: Request, res: Response, next) =>
    eventController.createEventBudget(req, res).catch((err) => next(err)),
);

router.put(
  "/events/:budgetId/edit-budget",
  [
    authMiddleware,
    accessControlMiddleware(AccessControls.EVENT_UPDATE),
    validate(editEventBudgetRules),
  ],
  (req: Request, res: Response, next) =>
    eventController.editEventBudget(req, res).catch((err) => next(err)),
);

router.delete(
  "/events/:budgetId/delete-budget",
  [authMiddleware, accessControlMiddleware(AccessControls.EVENT_DELETION)],
  (req: Request, res: Response, next) =>
    eventController.deleteEventBudget(req, res).catch((err) => next(err)),
);

router.put(
  "/events/recurring/update-dates",
  [authMiddleware, accessControlMiddleware(AccessControls.EVENT_UPDATE)],
  (req: Request, res: Response, next) =>
    eventController
      .updateRecurringEventDates(req, res)
      .catch((err) => next(err)),
);

export default router;
