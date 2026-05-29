import { injectable } from "tsyringe";
import CampusFactory from "../factories/campus.factory";
import CampusRepository from "../repositories/campus.repository";
import CampusPersonnelFactory from "../factories/campus_personnel.factory";
import CampusPersonnelRepository from "../repositories/campus_personnel.repository";
import UserRepository from "../../userManagement/repositories/user.repository";
import MemberRepository from "../../memberManagement/repositories/member.repository";
import MemberBirthdayRepository from "../../memberManagement/repositories/member_birthday.repository";
import FamilyRepository from "../../familyManagement/repositories/family.repository";
import VolunteerRepository from "../../volunteerManagement/repositories/volunteer.repo";
import VolunteerRoleRepository from "../../volunteerManagement/repositories/volunteer_role.repo";
import EventRepository from "../../eventManagement/repositories/event.repository";
import SacramentRepository from "../../sacramentManagement/repositories/sacrament.repository";
import PrayerRequestRepository from "../../prayerManagement/repositories/prayer_request.repository";
import PrayerWarriorRepository from "../../prayerManagement/repositories/prayer_warrior.repository";
import NewsRepository from "../../communicationManagement/repositories/news.repository";
import NewsletterRepository from "../../communicationManagement/repositories/newsletter.repository";
import CircularRepository from "../../communicationManagement/repositories/circular.repository";
import DiscussionBoardRepository from "../../communicationManagement/repositories/discussion_board.repository";
import AnnouncementRepository from "../../communicationManagement/repositories/announcement.repository";
import AssetRepository from "../../assetManagement/repositories/asset.repository";
import FacilityRepository from "../../facilitymanagement/repositories/facility.repository";
import DocumentRepository from "../../documentManagement/repositories/document.repository";
import { AddCampus } from "../dtos/add-campus.dto";
import logger from "@shared/utils/logger";
import AppError from "@shared/error/app.error";

@injectable()
class CampusService {
  constructor(
    private readonly campusRepository: CampusRepository,
    private readonly campusPersonnelRepository: CampusPersonnelRepository,
    private readonly userRepository: UserRepository,
    private readonly memberRepository: MemberRepository,
    private readonly memberBirthdayRepository: MemberBirthdayRepository,
    private readonly familyRepository: FamilyRepository,
    private readonly volunteerRepository: VolunteerRepository,
    private readonly volunteerRoleRepository: VolunteerRoleRepository,
    private readonly eventRepository: EventRepository,
    private readonly sacramentRepository: SacramentRepository,
    private readonly prayerRequestRepository: PrayerRequestRepository,
    private readonly prayerWarriorRepository: PrayerWarriorRepository,
    private readonly newsRepository: NewsRepository,
    private readonly newsletterRepository: NewsletterRepository,
    private readonly circularRepository: CircularRepository,
    private readonly discussionBoardRepository: DiscussionBoardRepository,
    private readonly announcementRepository: AnnouncementRepository,
    private readonly assetRepository: AssetRepository,
    private readonly facilityRepository: FacilityRepository,
    private readonly documentRepository: DocumentRepository,
  ) {}

  async addCampus(data: AddCampus, superAdminId: string) {
    try {
      const superAdmin = await this.userRepository.findById(superAdminId);
      if (!superAdmin) throw new AppError(400, "Super admin does not exist");

      const campus = CampusFactory.addCampus({
        campusName: data.campusName,
        campusCode: data.campusCode,
        campusAddress: data.campusAddress,
        campusEmail: data.campusEmail,
        campusPhoneNumber: data.campusPhoneNumber,
        campusPastor: data.campusPastor,
        localCurrency: data.localCurrency,
        timezone: data.timezone,
        established: data.established,
        status: "Active",
        churchId: String(superAdmin.churchId),
      });
      const newCampus = await this.campusRepository.save(campus);

      return {
        success: true,
        message: "Campus has been added successfully",
        campus: newCampus,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error adding campus");
      throw new AppError(
        400,
        error.message || "An unexpected error occurred while adding campus",
      );
    }
  }

  async getCampus(campusId: string) {
    const campus = await this.campusRepository.findById(campusId);
    if (!campus) throw new AppError(400, "Campus does not exist");

    return { success: true, campus };
  }

  async assignPersonnelToCampus(req: any) {
    try {
      const campus = await this.campusRepository.findById(req.params.campusId);
      if (!campus) throw new AppError(400, "Campus does not exist");

      const member = await this.memberRepository.findById(
        req.body.churchMemberId,
      );
      if (!member) throw new AppError(400, "Member does not exist");

      const personnel = CampusPersonnelFactory.assignPersonnel({
        personnelType: req.body.personnelType,
        personnelName: req.body.personnelName,
        department: req.body.department,
        memberId: member.id,
        campusId: campus.id,
      });
      const assignedPersonnel = await this.campusPersonnelRepository.save(
        personnel,
      );

      return {
        success: true,
        message: `Personnel has been assigned to ${campus.campusName} campus successfully`,
        personnel: assignedPersonnel,
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Error assigning personnel to campus",
      );
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while assigning personnel to campus",
      );
    }
  }

  async getAllChurchCampuses(req: any) {
    const churchId = req.params.churchId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: churchCampuses, totalRecords } =
        await this.campusRepository.findAndCountAll(
          { churchId },
          currentPage,
          pageSize,
        );

      if (churchCampuses.length === 0) {
        return {
          churchCampuses: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchCampuses,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching all church campuses" });
      throw new Error(
        "An unexpected error occurred while fetching all church campuses.",
      );
    }
  }

  async getCampusPersonnels(req: any) {
    const campusId = req.params.campusId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: campusPersonnels, totalRecords } =
        await this.campusPersonnelRepository.findAndCountAll(
          { campusId },
          currentPage,
          pageSize,
        );

      if (campusPersonnels.length === 0) {
        return {
          campusPersonnels: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        campusPersonnels,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching campus personnels" });
      throw new Error(
        "An unexpected error occurred while fetching campus personnels.",
      );
    }
  }

  async editCampus(req: any) {
    try {
      const data = req.body;
      const campus = await this.campusRepository.findById(req.params.campusId);
      if (!campus) throw new AppError(400, "Campus does not exist");

      await this.campusRepository.updateById(campus.id, {
        campusName: data.campusName,
        campusCode: data.campusCode,
        campusPastor: data.campusPastor,
        financeManager: data.financeManager,
      });

      return {
        success: true,
        message: "Campus info has been updated successfully",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to edit campus");
      throw new AppError(400, error.message);
    }
  }

  async deleteCampus(campusId: string) {
    const campus = await this.campusRepository.findById(campusId);
    if (!campus) throw new AppError(400, "Campus does not exist");

    await this.campusRepository.deleteById(campus.id);

    return `${campus.campusName} has been deleted successfully`;
  }

  async getCampusChurchMembers(req: any) {
    const campusAdminId = req.user.id;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const campusAdmin = await this.memberRepository.findById(campusAdminId);
      if (!campusAdmin) throw new AppError(404, "Campus admin not found");

      const { data: churchMembers, totalRecords } =
        await this.memberRepository.findAndCountAll(
          { campusId: campusAdmin.campusId },
          currentPage,
          pageSize,
        );

      if (churchMembers.length === 0) {
        return {
          members: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchMembers,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error) {
      logger.error({ error: "Error fetching campus church members" });
      throw new Error(
        "An unexpected error occurred while fetching campus church members.",
      );
    }
  }

  async getCampusChurchUpcomingMembersBirthdays(req: any) {
    const campusAdminId = req.user.id;
    const { range, page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;
    const rangeNumber = parseInt(range, 10) || 0;

    try {
      const campusAdmin = await this.memberRepository.findById(campusAdminId);
      if (!campusAdmin) throw new AppError(404, "Campus admin not found");

      const { data: membersBirthdays, totalRecords } =
        await this.memberBirthdayRepository.findUpcomingBirthdays(
          { campusId: campusAdmin.campusId },
          rangeNumber,
          currentPage,
          pageSize,
        );

      const birthdaysWithIsToday = membersBirthdays.map((b: any) => ({
        ...b,
        isToday: b.daysToGo === 0,
      }));

      if (birthdaysWithIsToday.length === 0) {
        return {
          membersBirthdays: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        membersBirthdays: birthdaysWithIsToday,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({
        error: "Error fetching all campus church upcoming members birthdays",
      });
      throw new Error(
        "An unexpected error occurred while fetching all campus church upcoming members birthdays.",
      );
    }
  }

  async getCampusFamilies(req: any) {
    const campusAdminId = req.user.id;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const campusAdmin = await this.memberRepository.findById(campusAdminId);
      if (!campusAdmin) throw new AppError(404, "Campus admin not found");

      const { data: families, totalRecords } =
        await this.familyRepository.findAndCountAll(
          { campusId: campusAdmin.campusId },
          currentPage,
          pageSize,
        );

      if (families.length === 0) {
        return {
          families: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        families,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error) {
      logger.error({ error: "Error fetching all campus families" });
      throw new Error(
        "An unexpected error occurred while fetching all campus families.",
      );
    }
  }

  async getCampusVolunteerRoles(req: any) {
    const campusAdminId = req.user.id;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const campusAdmin = await this.memberRepository.findById(campusAdminId);
      if (!campusAdmin) throw new AppError(404, "Campus admin not found");

      const { data: volunteerRoles, totalRecords } =
        await this.volunteerRoleRepository.findAndCountAll(
          { campusId: campusAdmin.campusId },
          currentPage,
          pageSize,
        );

      if (volunteerRoles.length === 0) {
        return {
          volunteerRoles: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const volunteerRolesWithVolunteers = await Promise.all(
        volunteerRoles.map(async (role) => {
          const volunteers = await this.volunteerRepository.findAll({
            volunteerRole: role.id,
          });
          return {
            ...role,
            volunteers,
            availableSlots:
              role.noOfVolunteersNeeded - Number(role.noOfAssignedVolunteers),
          };
        }),
      );

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        volunteerRoles: volunteerRolesWithVolunteers,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching campus volunteer roles" });
      throw new Error(
        "An unexpected error occurred while fetching campus volunteer roles.",
      );
    }
  }

  async getCampusVolunteers(req: any) {
    const campusAdminId = req.user.id;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const campusAdmin = await this.memberRepository.findById(campusAdminId);
      if (!campusAdmin) throw new AppError(404, "Campus admin not found");

      const { data: volunteers, totalRecords } =
        await this.volunteerRepository.findAndCountAll(
          { campusId: campusAdmin.campusId },
          currentPage,
          pageSize,
        );

      if (volunteers.length === 0) {
        return {
          volunteers: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        volunteers,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching campus volunteers" });
      throw new Error(
        "An unexpected error occurred while fetching campus volunteers.",
      );
    }
  }

  async getCampusChurchEvents(req: any) {
    const campusAdminId = req.user.id;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const campusAdmin = await this.memberRepository.findById(campusAdminId);
      if (!campusAdmin) throw new AppError(404, "Campus admin not found");

      const { data: churchEvents, totalRecords } =
        await this.eventRepository.findAndCountAll(
          { campusId: campusAdmin.campusId },
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

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchEvents,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching all campus events" });
      throw new Error(
        "An unexpected error occurred while fetching all campus events.",
      );
    }
  }

  async getCampusUpcomingChurchEvents(req: any) {
    const campusAdminId = req.user.id;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const campusAdmin = await this.memberRepository.findById(campusAdminId);
      if (!campusAdmin) throw new AppError(404, "Campus admin not found");

      const allEvents = await this.eventRepository.findAll({
        campusId: campusAdmin.campusId,
      });

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
        "Error fetching campus upcoming church events",
      );
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while fetching campus upcoming church events",
      );
    }
  }

  async getCampusRecurringChurchEvents(req: any) {
    const campusAdminId = req.user.id;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const campusAdmin = await this.memberRepository.findById(campusAdminId);
      if (!campusAdmin) throw new AppError(404, "Campus admin not found");

      const allEvents = await this.eventRepository.findAll({
        campusId: campusAdmin.campusId,
      });

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
        "Error fetching campus recurring church events",
      );
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while fetching campus recurring church events",
      );
    }
  }

  async getPastChurchEvents(req: any) {
    const campusAdminId = req.user.id;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const campusAdmin = await this.memberRepository.findById(campusAdminId);
      if (!campusAdmin) throw new AppError(404, "Campus admin not found");

      const allEvents = await this.eventRepository.findAll({
        campusId: campusAdmin.campusId,
      });

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
        "Error fetching campus past church events",
      );
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while fetching campus past church events",
      );
    }
  }

  async getCampusSacraments(req: any) {
    const campusAdminId = req.user.id;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const campusAdmin = await this.memberRepository.findById(campusAdminId);
      if (!campusAdmin) throw new AppError(404, "Campus admin not found");

      const { data: churchSacraments, totalRecords } =
        await this.sacramentRepository.findAndCountAll(
          { campusId: campusAdmin.campusId },
          currentPage,
          pageSize,
        );

      if (churchSacraments.length === 0) {
        return {
          churchSacraments: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchSacraments,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching all campus sacraments" });
      throw new Error(
        "An unexpected error occurred while fetching all campus sacraments.",
      );
    }
  }

  async getCampusPrayerRequests(req: any) {
    const campusAdminId = req.user.id;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const campusAdmin = await this.memberRepository.findById(campusAdminId);
      if (!campusAdmin) throw new AppError(404, "Campus admin not found");

      const { data: prayerRequests, totalRecords } =
        await this.prayerRequestRepository.findAndCountAll(
          { campusId: campusAdmin.campusId },
          currentPage,
          pageSize,
        );

      if (prayerRequests.length === 0) {
        return {
          prayerRequests: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        prayerRequests,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error) {
      logger.error({ error: "Error fetching campus prayer requests" });
      throw new Error(
        "An unexpected error occurred while fetching campus prayer requests.",
      );
    }
  }

  async getCampusPrayerWarriors(req: any) {
    const campusAdminId = req.user.id;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const campusAdmin = await this.memberRepository.findById(campusAdminId);
      if (!campusAdmin) throw new AppError(404, "Campus admin not found");

      const { data: prayerWarriors, totalRecords } =
        await this.prayerWarriorRepository.findAndCountAll(
          { campusId: campusAdmin.campusId },
          currentPage,
          pageSize,
        );

      if (prayerWarriors.length === 0) {
        return {
          prayerWarriors: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        prayerWarriors,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error) {
      logger.error({ error: "Error fetching campus prayer warriors" });
      throw new Error(
        "An unexpected error occurred while fetching campus prayer warriors.",
      );
    }
  }

  async getCampusNews(req: any) {
    const campusAdminId = req.user.id;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const campusAdmin = await this.memberRepository.findById(campusAdminId);
      if (!campusAdmin) throw new AppError(404, "Campus admin not found");

      const { data: churchNews, totalRecords } =
        await this.newsRepository.findAndCountAll(
          { campusId: campusAdmin.campusId },
          currentPage,
          pageSize,
        );

      if (churchNews.length === 0) {
        return {
          churchNews: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchNews,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error) {
      logger.error({ error: "Error fetching campus news" });
      throw new Error(
        "An unexpected error occurred while fetching campus news.",
      );
    }
  }

  async getCampusNewsletters(req: any) {
    const campusAdminId = req.user.id;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const campusAdmin = await this.memberRepository.findById(campusAdminId);
      if (!campusAdmin) throw new AppError(404, "Campus admin not found");

      const { data: churchNewsletters, totalRecords } =
        await this.newsletterRepository.findAndCountAll(
          { campusId: campusAdmin.campusId },
          currentPage,
          pageSize,
        );

      if (churchNewsletters.length === 0) {
        return {
          churchNewsletters: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchNewsletters,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error) {
      logger.error({ error: "Error fetching campus newsletters" });
      throw new Error(
        "An unexpected error occurred while fetching campus newsletters.",
      );
    }
  }

  async getCampusCirculars(req: any) {
    const campusAdminId = req.user.id;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const campusAdmin = await this.memberRepository.findById(campusAdminId);
      if (!campusAdmin) throw new AppError(404, "Campus admin not found");

      const { data: churchCirculars, totalRecords } =
        await this.circularRepository.findAndCountAll(
          { campusId: campusAdmin.campusId },
          currentPage,
          pageSize,
        );

      if (churchCirculars.length === 0) {
        return {
          churchCirculars: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchCirculars,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error) {
      logger.error({ error: "Error fetching campus circulars" });
      throw new Error(
        "An unexpected error occurred while fetching campus circulars.",
      );
    }
  }

  async getCampusDiscussionBoards(req: any) {
    const campusAdminId = req.user.id;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const campusAdmin = await this.memberRepository.findById(campusAdminId);
      if (!campusAdmin) throw new AppError(404, "Campus admin not found");

      const { data: churchDiscussionBoards, totalRecords } =
        await this.discussionBoardRepository.findAndCountAll(
          { campusId: campusAdmin.campusId },
          currentPage,
          pageSize,
        );

      if (churchDiscussionBoards.length === 0) {
        return {
          churchDiscussionBoards: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchDiscussionBoards,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error) {
      logger.error({ error: "Error fetching campus discussion boards" });
      throw new Error(
        "An unexpected error occurred while fetching campus discussion boards.",
      );
    }
  }

  async getCampusAnnouncements(req: any) {
    const campusAdminId = req.user.id;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const campusAdmin = await this.memberRepository.findById(campusAdminId);
      if (!campusAdmin) throw new AppError(404, "Campus admin not found");

      const { data: churchAnnouncements, totalRecords } =
        await this.announcementRepository.findAndCountAll(
          { campusId: campusAdmin.campusId },
          currentPage,
          pageSize,
        );

      if (churchAnnouncements.length === 0) {
        return {
          churchAnnouncements: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchAnnouncements,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching campus announcements" });
      throw new Error(
        "An unexpected error occurred while fetching campus announcements.",
      );
    }
  }

  async getCampusAssets(req: any) {
    const campusAdminId = req.user.id;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const campusAdmin = await this.memberRepository.findById(campusAdminId);
      if (!campusAdmin) throw new AppError(404, "Campus admin not found");

      const { data: churchAssets, totalRecords } =
        await this.assetRepository.findAndCountAll(
          { campusId: campusAdmin.campusId },
          currentPage,
          pageSize,
        );

      if (churchAssets.length === 0) {
        return {
          success: true,
          churchAssets: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchAssets,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error fetching campus assets");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while fetching campus assets",
      );
    }
  }

  async getCampusFacilities(req: any) {
    const campusAdminId = req.user.id;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const campusAdmin = await this.memberRepository.findById(campusAdminId);
      if (!campusAdmin) throw new AppError(404, "Campus admin not found");

      const { data: churchFacilities, totalRecords } =
        await this.facilityRepository.findAndCountAll(
          { campusId: campusAdmin.campusId },
          currentPage,
          pageSize,
        );

      if (churchFacilities.length === 0) {
        return {
          churchFacilities: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchFacilities,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching all church facilities" });
      throw new Error(
        "An unexpected error occurred while fetching all church facilities.",
      );
    }
  }

  async getCampusDocuments(req: any) {
    const campusAdminId = req.user.id;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const campusAdmin = await this.memberRepository.findById(campusAdminId);
      if (!campusAdmin) throw new AppError(404, "Campus admin not found");

      const { data: churchDocuments, totalRecords } =
        await this.documentRepository.findAndCountAll(
          { campusId: campusAdmin.campusId },
          currentPage,
          pageSize,
        );

      if (churchDocuments.length === 0) {
        return {
          churchDocuments: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchDocuments,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching campus documents" });
      throw new Error(
        "An unexpected error occurred while fetching campus documents.",
      );
    }
  }

  async getCampusDetails(campusAdminId: string) {
    const campusAdmin = await this.memberRepository.findById(campusAdminId);
    if (!campusAdmin) throw new AppError(404, "Campus admin not found");

    const campus = await this.campusRepository.findById(
      String(campusAdmin.campusId),
    );
    if (!campus) throw new AppError(400, "Campus does not exist");

    return { success: true, campus };
  }

  // services for form dropdowns
  async getAllChurchCampusesForDropdown(
    churchId: string,
  ): Promise<{ id: string; name: string }[]> {
    return await this.campusRepository.findAllForDropdown(
      { churchId },
      "id",
      "campusName",
    );
  }
}

export default CampusService;
