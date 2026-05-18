import { SuccessResponse, ErrorResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import EventService from "../services/event.service";
import httpStatus from "http-status";

@injectable()
class EventController {
  constructor(private readonly eventService: EventService) {}

  createNewEvent = async (req: Request, res: Response) => {
    const result: any = await this.eventService.createNewEvent(
      req.body,
      req.user.id,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  addAgenda = async (req: Request, res: Response) => {
    const result: any = await this.eventService.addAgenda(
      req.body,
      req.params.eventId,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  registerForEvent = async (req: Request, res: Response) => {
    const result: any = await this.eventService.registerForEvent(req);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  approveRegisteredAttendees = async (req: Request, res: Response) => {
    try {
      const result: any = await this.eventService.approveRegisteredAttendees(
        req,
      );
      if (result.success) {
        return res.send(SuccessResponse(result.message));
      } else {
        return res
          .status(400)
          .json({ status: result.success, message: result.message });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ status: false, message: "Failed to approve attendee" });
    }
  };

  submitEventReview = async (req: Request, res: Response) => {
    const result: any = await this.eventService.submitEventReview(
      req.body,
      req.params.eventId,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getEventReviews = async (req: Request, res: Response) => {
    try {
      const eventReviews = await this.eventService.getEventReviews(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", eventReviews));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getAllChurchEvents = async (req: Request, res: Response) => {
    try {
      const churchEvents = await this.eventService.getAllChurchEvents(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchEvents));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getUpcomingChurchEvents = async (req: Request, res: Response) => {
    try {
      const upcomingEvents = await this.eventService.getUpcomingChurchEvents(
        req,
      );
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", upcomingEvents));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getRecurringChurchEvents = async (req: Request, res: Response) => {
    try {
      const recurringEvents = await this.eventService.getRecurringChurchEvents(
        req,
      );
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", recurringEvents));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getPastChurchEvents = async (req: Request, res: Response) => {
    try {
      const pastEvents = await this.eventService.getPastChurchEvents(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", pastEvents));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getEventAgendas = async (req: Request, res: Response) => {
    try {
      const eventAgendas = await this.eventService.getEventAgendas(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", eventAgendas));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  getEventVolunteers = async (req: Request, res: Response) => {
    try {
      const eventVolunteers = await this.eventService.getEventVolunteers(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", eventVolunteers));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  checkInAttendees = async (req: Request, res: Response) => {
    try {
      const result: any = await this.eventService.checkInAttendees(req);
      if (result.success) {
        return res.send(SuccessResponse(result.message));
      } else {
        return res
          .status(400)
          .json({ status: result.success, message: result.message });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ status: false, message: "Failed to check in attendee" });
    }
  };

  editEvent = async (req: Request, res: Response) => {
    try {
      const result: any = await this.eventService.editEvent(req);
      if (result.success) {
        return res.send(SuccessResponse(result.message));
      } else {
        return res
          .status(400)
          .json({ status: result.success, message: result.message });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ status: false, message: "Failed to update event info" });
    }
  };

  deleteEvent = async (req: Request, res: Response) => {
    const response = await this.eventService.deleteEvent(req);

    return res.status(httpStatus.OK).send(SuccessResponse(response));
  };

  editAgenda = async (req: Request, res: Response) => {
    try {
      const result: any = await this.eventService.editAgenda(req);
      if (result.success) {
        return res.send(SuccessResponse(result.message));
      } else {
        return res
          .status(400)
          .json({ status: result.success, message: result.message });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ status: false, message: "Failed to update agenda info" });
    }
  };

  deleteAgenda = async (req: Request, res: Response) => {
    const response = await this.eventService.deleteAgenda(req);

    return res.status(httpStatus.OK).send(SuccessResponse(response));
  };

  getEventAndAttendees = async (req: Request, res: Response) => {
    try {
      const eventAndAttendees = await this.eventService.getEventAndAttendees(
        req,
      );
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", eventAndAttendees));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  createEventBudget = async (req: Request, res: Response) => {
    const result: any = await this.eventService.createEventBudget(
      req.body,
      req.params.eventId,
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  editEventBudget = async (req: Request, res: Response) => {
    try {
      const result: any = await this.eventService.editEventBudget(req);
      if (result.success) {
        return res.send(SuccessResponse(result.message));
      } else {
        return res
          .status(400)
          .json({ status: result.success, message: result.message });
      }
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };

  deleteEventBudget = async (req: Request, res: Response) => {
    const response = await this.eventService.deleteEventBudget(
      req.params.budgetId,
    );

    return res.status(httpStatus.OK).send(SuccessResponse(response));
  };

  updateRecurringEventDates = async (_req: Request, res: Response) => {
    try {
      const result: any = await this.eventService.updateRecurringEventDates();
      return res.status(httpStatus.OK).send(SuccessResponse(result.message));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };
}

export default EventController;
