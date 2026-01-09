import { injectable } from "tsyringe";
import { Request } from "express";
import EventFactory from "../factories/event.factory";
import EventRepository from "../repositories/event.repository";
import EventAgendaFactory from "../factories/event_agenda.factory";
import EventAgendaRepository from "../repositories/event_agenda.repository";
import EventAttendeeFactory from "../factories/event_attendee.factory";
import EventAttendeeRepository from "../repositories/event_attendee.repository";
import EventVolunteerFactory from "../factories/event_volunteer.factory";
import EventVolunteerRepository from "../repositories/event_volunteer.repository";
import EventReviewFactory from "../factories/event_review.factory";
import EventReviewRepository from "../repositories/event_review.repository";
import UserRepository from "../../userManagement/repositories/user.repository";
// import MemberRepository from "../../memberManagement/repositories/member.repository";
// import VolunteerRepository from "../../volunteerManagement/repositories/volunteer.repo";
import { CreateNewEvent } from "../dtos/create-new-event.dto";
import { AddNewAgenda } from "../dtos/add-agenda.dto";
import { RegisterForEvent } from "../dtos/register-for-event.dto";
import { VolunteerForEvent } from "../dtos/volunteer-for-event.dto";
import { SubmitReview } from "../dtos/submit-review.dto";
import logger from "@shared/utils/logger";
import AppError from "@shared/error/app.error";
import { normalizeDate } from "@shared/utils/functions.util";

@injectable()
class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventAgendaRepository: EventAgendaRepository,
    private readonly eventAttendeeRepository: EventAttendeeRepository,
    private readonly eventVolunteerRepository: EventVolunteerRepository,
    private readonly eventReviewRepository: EventReviewRepository,
    private readonly userRepository: UserRepository
  ) {}

  async createNewEvent(data: CreateNewEvent, superAdminId: string) {
    try {
      const superAdmin = await this.userRepository.findById(superAdminId);
      if (!superAdmin) throw new AppError(400, "Super admin does not exist");

      const eventDate = new Date(data.eventDate);
      const today = normalizeDate(new Date());
      const normalizedStart = normalizeDate(eventDate);
      if (normalizedStart < today) {
        throw new Error("You cannot schedule event in the past");
      }

      const newEvent = EventFactory.createNewEvent({
        eventTitle: data.eventTitle,
        description: data.description,
        category: data.category,
        location: data.location,
        eventDate: data.eventDate,
        startTime: data.startTime,
        endTime: data.endTime,
        maximumCapacity: data.maximumCapacity,
        maximumCapacityTracker: data.maximumCapacity,
        registration: data.registration,
        church: String(superAdmin.churchId),
      });
      const createdNewEvent = await this.eventRepository.save(newEvent);

      return {
        success: true,
        message: "New Event has been created successfully",
        newEvent: createdNewEvent,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating new event");
      throw new AppError(
        400,
        error.message || "An unexpected error occurred while creating new event"
      );
    }
  }

  async addAgenda(data: AddNewAgenda, eventId: string) {
    try {
      const churchEvent = await this.eventRepository.findById(eventId);
      if (!churchEvent) throw new AppError(400, "Church event does not exist");

      const agenda = EventAgendaFactory.addNewAgenda({
        time: data.time,
        duration: data.duration,
        title: data.title,
        description: data.description,
        assignedTo: data.assignedTo,
        role: data.role,
        churchEvent: churchEvent.id,
      });
      const addedAgenda = await this.eventAgendaRepository.save(agenda);

      return {
        success: true,
        message: "Agenda has been added to event schedule successfully",
        agenda: addedAgenda,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error adding agenda");
      throw new AppError(
        400,
        error.message || "An unexpected error occurred while adding agenda"
      );
    }
  }

  async registerForEvent(data: RegisterForEvent, eventId: string) {
    try {
      const churchEvent = await this.eventRepository.findById(eventId);
      if (!churchEvent) throw new AppError(400, "Church event does not exist");

      const attendee = EventAttendeeFactory.registerForEvent({
        name: data.name,
        churchEvent: churchEvent.id,
      });
      const registeredAttendee = await this.eventAttendeeRepository.save(
        attendee
      );

      await this.eventRepository.updateById(churchEvent.id, {
        maximumCapacity: churchEvent.maximumCapacity - 1,
      });

      return {
        success: true,
        message: "You have registered for this event successfully",
        attendee: registeredAttendee,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error registering for event");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while registering for event"
      );
    }
  }

  async approveRegisteredAttendees(req: any) {
    try {
      const attendee = await this.eventAttendeeRepository.findById(
        req.params.attendeeId
      );
      if (!attendee) throw new AppError(400, "Attendee does not exist");

      await this.eventAttendeeRepository.updateById(attendee.id, {
        status: "Confirmed",
      });

      return {
        success: true,
        message: "Attendee has been approved successfully",
      };
    } catch (error: any) {
      logger.error({
        error: "Error approving attendee",
      });
      throw new Error("An unexpected error occurred while approving attendee.");
    }
  }

  async volunteerForEvent(data: VolunteerForEvent, eventId: string) {
    try {
      const churchEvent = await this.eventRepository.findById(eventId);
      if (!churchEvent) throw new AppError(400, "Church event does not exist");

      const volunteer = EventVolunteerFactory.volunteerForEvent({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: data.role,
        churchEvent: churchEvent.id,
      });
      const eventVolunteer = await this.eventVolunteerRepository.save(
        volunteer
      );

      return {
        success: true,
        message: "You have volunteered for this event successfully",
        volunteer: eventVolunteer,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error volunteering for event");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while volunteering for event"
      );
    }
  }

  async submitEventReview(data: SubmitReview, eventId: string) {
    try {
      const churchEvent = await this.eventRepository.findById(eventId);
      if (!churchEvent) throw new AppError(400, "Church event does not exist");

      const review = EventReviewFactory.submitReview({
        submittedBy: data.submittedBy,
        eventReview: data.eventReview,
        churchEvent: churchEvent.id,
      });
      const eventReview = await this.eventReviewRepository.save(review);

      return {
        success: true,
        message: "You have submitted a review for this event successfully",
        review: eventReview,
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Error submitting review for event"
      );
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while submitting review for event"
      );
    }
  }

  async getEventReviews(req: any) {
    const eventId = req.params.eventId;
    const { page = 1, limit = 10 } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: eventReviews, totalRecords } =
        await this.eventReviewRepository.findAndCountAll({
          churchEvent: eventId,
        });

      if (eventReviews.length === 0) {
        return {
          leaves: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        eventReviews,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({
        error: "Error fetching reviews for this event",
      });
      throw new Error(
        "An unexpected error occurred while fetching reviews for this event."
      );
    }
  }

  async getAllChurchEvents(req: any) {
    const churchId = req.params.churchId;
    const { page = 1, limit = 10 } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: churchEvents, totalRecords } =
        await this.eventRepository.findAndCountAll({ church: churchId });

      if (churchEvents.length === 0) {
        return {
          leaves: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchEvents,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching all church events" });
      throw new Error(
        "An unexpected error occurred while fetching all church events."
      );
    }
  }

  async getRegisteredAttendees(req: any) {
    const eventId = req.params.eventId;
    const { page = 1, limit = 10 } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: registeredAttendees, totalRecords } =
        await this.eventAttendeeRepository.findAndCountAll({
          churchEvent: eventId,
        });

      if (registeredAttendees.length === 0) {
        return {
          leaves: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        registeredAttendees,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({
        error: "Error fetching registered attendees for this event",
      });
      throw new Error(
        "An unexpected error occurred while fetching registered attendees for this event."
      );
    }
  }

  async getEventAgendas(req: any) {
    const eventId = req.params.eventId;
    const { page = 1, limit = 10 } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: eventAgendas, totalRecords } =
        await this.eventAgendaRepository.findAndCountAll({
          churchEvent: eventId,
        });

      if (eventAgendas.length === 0) {
        return {
          leaves: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        eventAgendas,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({
        error: "Error fetching agendas for this event",
      });
      throw new Error(
        "An unexpected error occurred while fetching agendas for this event."
      );
    }
  }

  async getEventVolunteers(req: any) {
    const eventId = req.params.eventId;
    const { page = 1, limit = 10 } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: eventVolunteers, totalRecords } =
        await this.eventVolunteerRepository.findAndCountAll({
          churchEvent: eventId,
        });

      if (eventVolunteers.length === 0) {
        return {
          leaves: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        eventVolunteers,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({
        error: "Error fetching volunteers for this event",
      });
      throw new Error(
        "An unexpected error occurred while fetching volunteers for this event."
      );
    }
  }

  async checkInAttendees(req: Request) {
    try {
      const attendee = await this.eventAttendeeRepository.findById(
        req.params.attendeeId
      );
      if (!attendee) throw new AppError(400, "Attendee does not exist");

      if (attendee.status === "Pending") {
        return {
          success: false,
          message: "Attendee has not been approved",
        };
      }

      await this.eventAttendeeRepository.updateById(attendee.id, {
        checkedIn: true,
      });

      return {
        success: true,
        message: "Attendee checked in successfully",
      };
    } catch (error: any) {
      logger.error({
        error: "Error checking in attendee",
      });
      throw new Error(
        "An unexpected error occurred while checking in attendee."
      );
    }
  }

  async editEvent(req: Request) {
    try {
      const data = req.body;
      const churchEvent = await this.eventRepository.findById(
        req.params.eventId
      );
      if (!churchEvent) throw new AppError(400, "Church event does not exist");

      await this.eventRepository.updateById(churchEvent.id, {
        eventTitle: data.eventTitle,
        description: data.description,
        category: data.category,
        location: data.location,
        eventDate: data.eventDate,
        startTime: data.startTime,
        endTime: data.endTime,
        maximumCapacity: data.maximumCapacity,
        registration: data.registration,
      });

      return {
        success: true,
        message: "Event info has been edited successfully",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to edit event");
      throw new AppError(400, error.message);
    }
  }

  async deleteEvent(req: Request) {
    const churchEvent = await this.eventRepository.findById(req.params.eventId);
    if (!churchEvent) throw new AppError(400, "Church event does not exist");

    await this.eventRepository.deleteById(churchEvent.id);

    return "Event has been deleted successfully";
  }

  async editAgenda(req: Request) {
    try {
      const data = req.body;
      const agenda = await this.eventAgendaRepository.findById(
        req.params.agendaId
      );
      if (!agenda) throw new AppError(400, "Agenda does not exist");

      await this.eventAgendaRepository.updateById(agenda.id, {
        time: data.time,
        duration: data.duration,
        title: data.title,
        description: data.description,
        assignedTo: data.assignedTo,
        role: data.role,
      });

      return {
        success: true,
        message: "Agenda info has been edited successfully",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to edit agenda");
      throw new AppError(400, error.message);
    }
  }

  async deleteAgenda(req: Request) {
    const agenda = await this.eventAgendaRepository.findById(
      req.params.agendaId
    );
    if (!agenda) throw new AppError(400, "Agenda does not exist");

    await this.eventAgendaRepository.deleteById(agenda.id);

    return "Agenda has been deleted successfully";
  }
}

export default EventService;
