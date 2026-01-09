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
      req.user.id
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  addAgenda = async (req: Request, res: Response) => {
    const result: any = await this.eventService.addAgenda(
      req.body,
      req.params.eventId
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  registerForEvent = async (req: Request, res: Response) => {
    const result: any = await this.eventService.registerForEvent(
      req.body,
      req.params.eventId
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  approveRegisteredAttendees = async (req: Request, res: Response) => {
    try {
      const result: any = await this.eventService.approveRegisteredAttendees(
        req
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

  volunteerForEvent = async (req: Request, res: Response) => {
    const result: any = await this.eventService.volunteerForEvent(
      req.body,
      req.params.eventId
    );
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  submitEventReview = async (req: Request, res: Response) => {
    const result: any = await this.eventService.submitEventReview(
      req.body,
      req.params.eventId
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

  getRegisteredAttendees = async (req: Request, res: Response) => {
    try {
      const registeredAttendees =
        await this.eventService.getRegisteredAttendees(req);
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", registeredAttendees));
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
        .json({ status: false, message: "Failed to edit event info" });
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
        .json({ status: false, message: "Failed to edit agenda info" });
    }
  };

  deleteAgenda = async (req: Request, res: Response) => {
    const response = await this.eventService.deleteAgenda(req);

    return res.status(httpStatus.OK).send(SuccessResponse(response));
  };
}

export default EventController;
