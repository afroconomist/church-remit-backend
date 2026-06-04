import { injectable } from "tsyringe";
import { Request } from "express";
import EventFactory from "../factories/event.factory";
import EventRepository from "../repositories/event.repository";
import EventAgendaFactory from "../factories/event_agenda.factory";
import EventAgendaRepository from "../repositories/event_agenda.repository";
import EventAttendeeFactory from "../factories/event_attendee.factory";
import EventAttendeeRepository from "../repositories/event_attendee.repository";
import EventReviewFactory from "../factories/event_review.factory";
import EventReviewRepository from "../repositories/event_review.repository";
import EventBudgetFactory from "../factories/event_budget.factory";
import EventBudgetRepository from "../repositories/event_budget.repository";
import UserRepository from "../../userManagement/repositories/user.repository";
import MemberRepository from "../../memberManagement/repositories/member.repository";
import VolunteerRoleRepository from "../../volunteerManagement/repositories/volunteer_role.repo";
import VolunteerRoleAssignmentRepository from "../../volunteerManagement/repositories/volunteer_role_assignment.repository";
import VolunteerRepository from "../../volunteerManagement/repositories/volunteer.repo";
import CampusRepository from "../../campusManagement/repositories/campus.repository";
import { SubmitReview } from "../dtos/submit-review.dto";
import { CreateEventBudget } from "../dtos/event-budget.dto";
import logger from "@shared/utils/logger";
import AppError from "@shared/error/app.error";
import {
  normalizeDate,
  validateAgendaTimeWithinEventDuration,
  checkAgendaOverlap,
  calculateNextEventDate,
} from "@shared/utils/functions.util";

interface CreateNewEventPayload {
  eventTitle: string;
  description: Text;
  category: string;
  location: string;
  eventDate: string;
  nextEventDate?: string;
  eventStartTime: string;
  eventEndTime: string;
  maximumCapacity: number;
  maximumCapacityTracker: number;
  registration: boolean;
  recurring?: boolean;
  eventFrequency?: "weekly" | "monthly" | "quarterly" | "yearly";
  church: string;
  campusId?: string;
}

interface AddNewAgendaPayload {
  startTime: string;
  endTime: string;
  duration: string;
  title: string;
  description: string;
  assignedTo: string;
  role: string;
}

@injectable()
class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventAgendaRepository: EventAgendaRepository,
    private readonly eventAttendeeRepository: EventAttendeeRepository,
    private readonly eventReviewRepository: EventReviewRepository,
    private readonly eventBudgetRepository: EventBudgetRepository,
    private readonly userRepository: UserRepository,
    private readonly memberRepository: MemberRepository,
    private readonly volunteerRoleRepository: VolunteerRoleRepository,
    private readonly volunteerRoleAssignmentRepository: VolunteerRoleAssignmentRepository,
    private readonly volunteerRepository: VolunteerRepository,
    private readonly campusRepository: CampusRepository,
  ) {}

  async createNewEvent(data: CreateNewEventPayload, adminId: string) {
    try {
      const [superAdmin, campusAdmin] = await Promise.all([
        this.userRepository.findById(adminId),
        this.memberRepository.findById(adminId),
      ]);
      const admin = superAdmin ? superAdmin : campusAdmin;

      const startTime = data.eventStartTime;
      const endTime = data.eventEndTime;
      if (endTime <= startTime)
        return {
          success: false,
          message: "Event end time must be after event start time",
        };

      const eventDate = new Date(data.eventDate);
      const today = normalizeDate(new Date());
      const normalizedStart = normalizeDate(eventDate);
      if (normalizedStart < today) {
        throw new Error("You cannot schedule event in the past");
      }

      let nextEventDateString: string | undefined;
      if (data.recurring && data.eventFrequency) {
        const nextEventDate = calculateNextEventDate(
          eventDate,
          data.eventFrequency,
        );
        nextEventDateString = nextEventDate.toISOString().split("T")[0];
      }

      let campusId;
      if (data.campusId || data.campusId === null) {
        campusId = data.campusId;
      } else {
        campusId = admin.campusId;
      }
      const newEvent = EventFactory.createNewEvent({
        eventTitle: data.eventTitle,
        description: data.description,
        category: data.category,
        location: data.location,
        eventDate: data.eventDate,
        nextEventDate: nextEventDateString,
        eventStartTime: data.eventStartTime,
        eventEndTime: data.eventEndTime,
        maximumCapacity: data.maximumCapacity,
        maximumCapacityTracker: 0,
        registration: data.registration,
        recurring: data.recurring,
        eventFrequency: data.eventFrequency,
        campusId,
        church: String(admin.churchId),
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
        error.message ||
          "An unexpected error occurred while creating new event",
      );
    }
  }

  async addAgenda(data: AddNewAgendaPayload, eventId: string) {
    try {
      const churchEvent = await this.eventRepository.findById(eventId);
      if (!churchEvent) throw new AppError(400, "Church event does not exist");

      const timeValidation = validateAgendaTimeWithinEventDuration(
        data.startTime,
        data.endTime,
        churchEvent.eventStartTime,
        churchEvent.eventEndTime,
      );

      if (!timeValidation.isValid) {
        throw new AppError(400, timeValidation.error);
      }

      const existingAgendas = await this.eventAgendaRepository.findAll({
        churchEvent: churchEvent.id,
      });

      const overlapCheck = checkAgendaOverlap(
        data.startTime,
        data.endTime,
        existingAgendas,
      );

      if (overlapCheck.hasOverlap) {
        throw new AppError(400, overlapCheck.error);
      }

      const agenda = EventAgendaFactory.addNewAgenda({
        startTime: data.startTime,
        endTime: data.endTime,
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
        error.statusCode || 400,
        error.message || "An unexpected error occurred while adding agenda",
      );
    }
  }

  async registerForEvent(req: any) {
    try {
      const churchEvent = await this.eventRepository.findById(
        req.params.eventId,
      );
      if (!churchEvent) throw new AppError(400, "Church event does not exist");

      if (
        churchEvent.maximumCapacity === churchEvent.maximumCapacityTracker &&
        churchEvent.maximumCapacity !== 0
      ) {
        return {
          status: false,
          message: `Maximum capacity of ${churchEvent.maximumCapacity} event attendees have been met`,
        };
      }

      const [member, admin] = await Promise.all([
        this.memberRepository.findById(req.user.id),
        this.userRepository.findById(req.user.id),
      ]);

      let attendeeName;
      if (member) {
        attendeeName = `${member.firstName} ${member.lastName}`;
      } else if (admin) {
        attendeeName = `${admin.firstName} ${admin.lastName}`;
      }

      const attendeeExist = await this.eventAttendeeRepository.findOne({
        name: attendeeName,
        churchEvent: churchEvent.id,
      });
      if (attendeeExist) {
        return {
          status: false,
          message: `${attendeeName} is already registered for this event`,
        };
      }

      const attendee = EventAttendeeFactory.registerForEvent({
        name: attendeeName,
        churchEvent: churchEvent.id,
      });
      const registeredAttendee = await this.eventAttendeeRepository.save(
        attendee,
      );

      await this.eventRepository.updateById(churchEvent.id, {
        maximumCapacityTracker: churchEvent.maximumCapacityTracker + 1,
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
          "An unexpected error occurred while registering for event",
      );
    }
  }

  async approveRegisteredAttendees(req: any) {
    try {
      const attendee = await this.eventAttendeeRepository.findById(
        req.params.attendeeId,
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
        "Error submitting review for event",
      );
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while submitting review for event",
      );
    }
  }

  async getEventReviews(req: any) {
    const eventId = req.params.eventId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: eventReviews, totalRecords } =
        await this.eventReviewRepository.findAndCountAll(
          {
            churchEvent: eventId,
          },
          currentPage,
          pageSize,
        );

      if (eventReviews.length === 0) {
        return {
          eventReviews: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      let totalAttendees;
      const eventAttendees = await this.eventAttendeeRepository.findAll({
        checkedIn: true,
        churchEvent: eventId,
      });
      totalAttendees = eventAttendees ? eventAttendees.length : 0;

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        eventReviews,
        totalAttendees,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({
        error: "Error fetching reviews for this event",
      });
      throw new Error(
        "An unexpected error occurred while fetching reviews for this event.",
      );
    }
  }

  async getAllChurchEvents(req: any) {
    const churchId = req.params.churchId;
    const { page, limit, campusId } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const filter: any = { church: churchId };
      if (campusId) {
        filter.campusId = campusId;
      }

      const { data: churchEvents, totalRecords } =
        await this.eventRepository.findAndCountAll(
          filter,
          currentPage,
          pageSize,
        );

      if (churchEvents.length === 0) {
        return {
          churchEvents: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const churchEventIds = churchEvents.map((event: any) => event.id);
      let totalAttendees;
      const eventAttendees = await this.eventAttendeeRepository.findAll({
        churchEvent: churchEventIds,
      });
      totalAttendees = eventAttendees ? eventAttendees.length : 0;

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchEvents,
        totalAttendees,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching all church events" });
      throw new Error(
        "An unexpected error occurred while fetching all church events.",
      );
    }
  }

  async getUpcomingChurchEvents(req: any) {
    const churchId = req.params.churchId;
    const { page, limit, campusId } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const filter: any = { church: churchId };
      if (campusId) {
        filter.campusId = campusId;
      }

      const allEvents = await this.eventRepository.findAll(filter);

      const upcomingEvents = allEvents.filter((event: any) => {
        const eventDate = new Date(event.eventDate);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      });

      const totalRecords = upcomingEvents.length;

      if (upcomingEvents.length === 0) {
        return {
          upcomingEvents: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const paginatedEvents = upcomingEvents.slice(start, end);

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        upcomingEvents: paginatedEvents,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Error fetching upcoming church events",
      );
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while fetching upcoming church events",
      );
    }
  }

  async getRecurringChurchEvents(req: any) {
    const churchId = req.params.churchId;
    const { page, limit, campusId } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const filter: any = { church: churchId };
      if (campusId) {
        filter.campusId = campusId;
      }

      const allEvents = await this.eventRepository.findAll(filter);

      const recurringEvents = allEvents.filter(
        (event: any) => event.recurring === true,
      );

      const totalRecords = recurringEvents.length;

      if (recurringEvents.length === 0) {
        return {
          recurringEvents: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const paginatedEvents = recurringEvents.slice(start, end);

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        recurringEvents: paginatedEvents,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Error fetching recurring church events",
      );
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while fetching recurring church events",
      );
    }
  }

  async getPastChurchEvents(req: any) {
    const churchId = req.params.churchId;
    const { page, limit, campusId } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const filter: any = { church: churchId };
      if (campusId) {
        filter.campusId = campusId;
      }

      const allEvents = await this.eventRepository.findAll(filter);

      const pastEvents = allEvents.filter((event: any) => {
        const eventDate = new Date(event.eventDate);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate < today && event.recurring === false;
      });

      const totalRecords = pastEvents.length;

      if (pastEvents.length === 0) {
        return {
          pastEvents: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const paginatedEvents = pastEvents.slice(start, end);

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        pastEvents: paginatedEvents,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Error fetching past church events",
      );
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while fetching past church events",
      );
    }
  }

  async getEventAgendas(req: any) {
    const eventId = req.params.eventId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: eventAgendas, totalRecords } =
        await this.eventAgendaRepository.findAndCountAll(
          {
            churchEvent: eventId,
          },
          currentPage,
          pageSize,
        );

      if (eventAgendas.length === 0) {
        return {
          eventAgendas: [],
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
        "An unexpected error occurred while fetching agendas for this event.",
      );
    }
  }

  async getEventVolunteers(req: any) {
    const eventId = req.params.eventId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const event = await this.eventRepository.findById(eventId);
      if (!event) throw new AppError(400, "Event does not exist");

      const eventVolunteerRoles = await this.volunteerRoleRepository.findAll({
        eventId: event.id,
      });
      const volunteerRoleIds = eventVolunteerRoles.map((role) => role.id);
      const volunteerRoleAssignments =
        await this.volunteerRoleAssignmentRepository.findAll({
          volunteerRoleId: volunteerRoleIds,
        });
      const volunteerIds = volunteerRoleAssignments.map(
        (assignment) => assignment.volunteerId,
      );

      const { data: eventVolunteers, totalRecords } =
        await this.volunteerRepository.findAndCountAll(
          {
            id: volunteerIds,
          },
          currentPage,
          pageSize,
        );

      if (eventVolunteers.length === 0) {
        return {
          eventVolunteers: [],
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
        "An unexpected error occurred while fetching volunteers for this event.",
      );
    }
  }

  async checkInAttendees(req: Request) {
    try {
      const attendee = await this.eventAttendeeRepository.findById(
        req.params.attendeeId,
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
        "An unexpected error occurred while checking in attendee.",
      );
    }
  }

  async editEvent(req: Request) {
    try {
      const data = req.body;
      const churchEvent = await this.eventRepository.findById(
        req.params.eventId,
      );
      if (!churchEvent) throw new AppError(400, "Church event does not exist");

      const pastEventDate = new Date(churchEvent.eventDate);
      const today = normalizeDate(new Date());
      const normalizedPastEventDate = normalizeDate(pastEventDate);
      if (normalizedPastEventDate < today && !churchEvent.recurring) {
        throw new AppError(400, "Cannot edit past events");
      }

      const eventDate = new Date(data.eventDate);
      const presentDay = normalizeDate(new Date());
      const normalizedStart = normalizeDate(eventDate);
      if (normalizedStart < presentDay) {
        throw new Error("You cannot schedule event in the past");
      }

      let nextEventDateString: string | undefined;
      if (data.recurring && data.eventFrequency) {
        const nextEventDate = calculateNextEventDate(
          eventDate,
          data.eventFrequency,
        );
        nextEventDateString = nextEventDate.toISOString().split("T")[0];
      }

      const startTime = data.eventStartTime;
      const endTime = data.eventEndTime;
      if (endTime <= startTime)
        return {
          success: false,
          message: "Event end time must be after event start time",
        };

      const existingAgendas = await this.eventAgendaRepository.findAll({
        churchEvent: churchEvent.id,
      });

      if (existingAgendas && existingAgendas.length > 0) {
        for (const agenda of existingAgendas) {
          const agendaValidation = validateAgendaTimeWithinEventDuration(
            agenda.startTime,
            agenda.endTime,
            data.eventStartTime,
            data.eventEndTime,
          );

          if (!agendaValidation.isValid)
            return {
              success: false,
              message: `Existing agenda ${agenda.title} does not fit within the new event duration. ${agendaValidation.error}. Please adjust the agenda durations to meet the new event duration.`,
            };
        }
      }

      const eventFrequency = data.eventFrequency ? data.eventFrequency : null;
      await this.eventRepository.updateById(churchEvent.id, {
        eventTitle: data.eventTitle,
        description: data.description,
        category: data.category,
        location: data.location,
        eventDate: data.eventDate,
        nextEventDate: nextEventDateString,
        eventStartTime: data.eventStartTime,
        eventEndTime: data.eventEndTime,
        maximumCapacity: data.maximumCapacity,
        registration: data.registration,
        recurring: data.recurring,
        eventFrequency,
        campusId: data.campusId,
      });

      return {
        success: true,
        message: "Event info has been updated successfully",
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
        req.params.agendaId,
      );
      if (!agenda) throw new AppError(400, "Agenda does not exist");

      const churchEvent = await this.eventRepository.findById(
        String(agenda.churchEvent),
      );
      if (!churchEvent) throw new AppError(400, "Church event does not exist");

      const timeValidation = validateAgendaTimeWithinEventDuration(
        data.startTime || agenda.startTime,
        data.endTime || agenda.endTime,
        churchEvent.eventStartTime,
        churchEvent.eventEndTime,
      );

      if (!timeValidation.isValid) {
        throw new AppError(400, timeValidation.error);
      }

      const existingAgendas = await this.eventAgendaRepository.findAll({
        churchEvent: churchEvent.id,
      });

      const otherAgendas = existingAgendas.filter(
        (ag: any) => ag.id !== agenda.id,
      );

      const overlapCheck = checkAgendaOverlap(
        data.startTime || agenda.startTime,
        data.endTime || agenda.endTime,
        otherAgendas,
      );

      if (overlapCheck.hasOverlap) {
        throw new AppError(400, overlapCheck.error);
      }

      await this.eventAgendaRepository.updateById(agenda.id, {
        startTime: data.startTime || agenda.startTime,
        endTime: data.endTime || agenda.endTime,
        duration: data.duration || agenda.duration,
        title: data.title || agenda.title,
        description: data.description || agenda.description,
        assignedTo: data.assignedTo || agenda.assignedTo,
        role: data.role || agenda.role,
      });

      return {
        success: true,
        message: "Agenda info has been updated successfully",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to edit agenda");
      throw new AppError(error.statusCode || 400, error.message);
    }
  }

  async deleteAgenda(req: Request) {
    const agenda = await this.eventAgendaRepository.findById(
      req.params.agendaId,
    );
    if (!agenda) throw new AppError(400, "Agenda does not exist");

    await this.eventAgendaRepository.deleteById(agenda.id);

    return "Agenda has been deleted successfully";
  }

  async getEventAndAttendees(req: any) {
    const eventId = req.params.eventId;
    const userId = req.user.id;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const churchEvent = await this.eventRepository.findById(eventId);
      if (!churchEvent) throw new AppError(400, "Church event does not exist");

      const { data: registeredAttendees, totalRecords } =
        await this.eventAttendeeRepository.findAndCountAll(
          {
            churchEvent: churchEvent.id,
          },
          currentPage,
          pageSize,
        );

      const eventVolunteerRoles = await this.volunteerRoleRepository.findAll({
        eventId: churchEvent.id,
      });
      const eventVolunteerRolesIds = eventVolunteerRoles.map((role) => role.id);
      const volunteerRoleAssignments =
        await this.volunteerRoleAssignmentRepository.findAll({
          volunteerRoleId: eventVolunteerRolesIds,
        });
      const eventVolunteerIds = volunteerRoleAssignments.map(
        (assignment) => assignment.volunteerId,
      );
      const eventVolunteers = await this.volunteerRepository.findAll({
        id: eventVolunteerIds,
      });

      let isRegistered;
      if (churchEvent.registration) {
        const [member, admin] = await Promise.all([
          this.memberRepository.findById(userId),
          this.userRepository.findById(userId),
        ]);
        let registeredAttendeeName;
        registeredAttendeeName = member
          ? `${member.firstName} ${member.lastName}`
          : `${admin.firstName} ${admin.lastName}`;

        isRegistered = registeredAttendees.some(
          (attendee: any) => attendee.name === registeredAttendeeName,
        );
      }

      let campusName;
      if (churchEvent.campusId) {
        const campus = await this.campusRepository.findById(
          String(churchEvent.campusId),
        );
        if (!campus) throw new AppError(400, "Campus does not exist");
        campusName = campus.campusName;
      } else {
        campusName = null;
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchEvent: {
          ...churchEvent,
          campusName,
        },
        registeredAttendees:
          registeredAttendees.length > 0 ? registeredAttendees : [],
        eventVolunteers: eventVolunteers.length > 0 ? eventVolunteers : [],
        isRegistered,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({
        error: "Error fetching event and registered attendees for this event",
      });
      throw new Error(
        "An unexpected error occurred while fetching event and registered attendees for this event.",
      );
    }
  }

  async createEventBudget(data: CreateEventBudget, eventId: string) {
    try {
      const churchEvent = await this.eventRepository.findById(eventId);
      if (!churchEvent) throw new AppError(400, "Church event does not exist");

      const eventBudget = EventBudgetFactory.createEventBudget({
        category: data.category,
        itemDescription: data.itemDescription,
        budgetedAmount: data.budgetedAmount,
        eventId: churchEvent.id,
      });

      const createdEventBudget = await this.eventBudgetRepository.save(
        eventBudget,
      );

      return {
        success: true,
        message: "Event budget has been created successfully",
        eventBudget: createdEventBudget,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating event budget");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while creating event budget",
      );
    }
  }

  async getAllEventBudgets(req: any) {
    const eventId = req.params.eventId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: eventBudgets, totalRecords } =
        await this.eventBudgetRepository.findAndCountAll(
          {
            eventId,
          },
          currentPage,
          pageSize,
        );

      if (eventBudgets.length === 0) {
        return {
          eventBudgets: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        eventBudgets,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({
        error: "Error fetching budgets for this event",
      });
      throw new Error(
        "An unexpected error occurred while fetching budgets for this event.",
      );
    }
  }

  async editEventBudget(req: any) {
    try {
      const eventBudget = await this.eventBudgetRepository.findById(
        req.params.budgetId,
      );
      if (!eventBudget) throw new AppError(400, "Event budget does not exist");

      const updatedData: any = {};

      if (req.body.category) updatedData.category = req.body.category;
      if (req.body.itemDescription)
        updatedData.itemDescription = req.body.itemDescription;
      if (req.body.budgetedAmount)
        updatedData.budgetedAmount = req.body.budgetedAmount;
      if (req.body.actualAmount !== undefined)
        updatedData.actualAmount = req.body.actualAmount;
      if (req.body.status) updatedData.status = req.body.status;

      if (
        updatedData.budgetedAmount ||
        updatedData.actualAmount !== undefined
      ) {
        const budgetedAmount =
          updatedData.budgetedAmount || eventBudget.budgetedAmount;
        const actualAmount =
          updatedData.actualAmount !== undefined
            ? updatedData.actualAmount
            : eventBudget.actualAmount;
        updatedData.variance = actualAmount - budgetedAmount;
      }

      await this.eventBudgetRepository.updateById(eventBudget.id, updatedData);

      return {
        success: true,
        message: "Event budget has been updated successfully",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error editing event budget");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while editing event budget",
      );
    }
  }

  async deleteEventBudget(budgetId: string) {
    const eventBudget = await this.eventBudgetRepository.findById(budgetId);
    if (!eventBudget) throw new AppError(400, "Event budget does not exist");

    await this.eventBudgetRepository.deleteById(budgetId);

    return "Event budget has been deleted successfully";
  }

  async updateRecurringEventDates() {
    try {
      const allRecurringEvents = await this.eventRepository.findAll({
        recurring: true,
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const event of allRecurringEvents) {
        const eventDate = new Date(event.eventDate);
        eventDate.setHours(0, 0, 0, 0);

        // Check if event date is in the past or today
        if (eventDate <= today && event.nextEventDate && event.eventFrequency) {
          const nextEventDate = new Date(event.nextEventDate);
          const calculatedNextDate = calculateNextEventDate(
            nextEventDate,
            event.eventFrequency,
          );

          await this.eventRepository.updateById(event.id, {
            eventDate: nextEventDate.toISOString().split("T")[0],
            nextEventDate: calculatedNextDate.toISOString().split("T")[0],
          });
        }
      }

      return {
        success: true,
        message: "Recurring event dates have been updated successfully",
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Error updating recurring event dates",
      );
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while updating recurring event dates",
      );
    }
  }
}

export default EventService;
