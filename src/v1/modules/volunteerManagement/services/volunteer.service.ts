import { injectable } from "tsyringe";
import { Request } from "express";
import { CreateVolunteerRole } from "../dtos/create-volunteer-role.dto";
import VolunteerRoleFactory from "../factories/volunteer_role.factory";
import VolunteerRoleRepository from "../repositories/volunteer_role.repo";
import VolunteerRoleAssignmentRepository from "../repositories/volunteer_role_assignment.repository";
import VolunteerFactory from "../factories/volunteer.factory";
import VolunteerRepository from "../repositories/volunteer.repo";
import UserRepository from "../../userManagement/repositories/user.repository";
import MemberRepository from "../../memberManagement/repositories/member.repository";
import MemberFactory from "../../memberManagement/factories/member.factory";
import EventRepository from "../../eventManagement/repositories/event.repository";
import MailService from "../../notificationAndEmailManagement/services/mail.service";
import logger from "@shared/utils/logger";
import AppError from "@shared/error/app.error";
import RoleRepo from "../../accessControlManagement/repositories/role.repo";
import { generateCode } from "@shared/utils/functions.util";

@injectable()
class VolunteerService {
  constructor(
    private readonly volunteerRoleRepository: VolunteerRoleRepository,
    private readonly volunteerRoleAssignmentRepository: VolunteerRoleAssignmentRepository,
    private readonly volunteerRepository: VolunteerRepository,
    private readonly userRepository: UserRepository,
    private readonly memberRepository: MemberRepository,
    private readonly eventRepository: EventRepository,
    private readonly mailService: MailService,
    private readonly roleRepo: RoleRepo,
  ) {}

  async createVolunteerRole(data: CreateVolunteerRole, adminId: string) {
    try {
      const [superAdmin, campusAdmin] = await Promise.all([
        this.userRepository.findById(adminId),
        this.memberRepository.findById(adminId),
      ]);
      const admin = superAdmin ? superAdmin : campusAdmin;

      const churchEvent = await this.eventRepository.findById(data.event_id);
      if (!churchEvent) throw new AppError(400, "Church event does not exist");

      const volunteerRole = VolunteerRoleFactory.createVolunteerRole({
        ...data,
        eventId: churchEvent.id,
        campusId: churchEvent.campusId,
        church: String(admin.churchId),
      });
      const newVolunteerRole = await this.volunteerRoleRepository.save(
        volunteerRole,
      );

      return {
        success: true,
        message: "Volunteer role has been created successfully",
        volunteer_role: newVolunteerRole,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating a volunteer role");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while creating a volunteer role",
      );
    }
  }

  async addNewVolunteer(req: Request) {
    const data = req.body;
    const adminId = req.user.id;

    try {
      const [superAdmin, campusAdmin] = await Promise.all([
        this.userRepository.findById(adminId),
        this.memberRepository.findById(adminId),
      ]);
      const admin = superAdmin ? superAdmin : campusAdmin;

      const accountExist = await this.userRepository.findOne({
        email: data.email,
      });
      if (accountExist)
        return {
          status: false,
          message: "Account already exist with this email. Use another!",
        };

      const member = await this.memberRepository.findOne({ email: data.email });
      if (member) {
        const volunteer = VolunteerFactory.addNewVolunteer({
          name: `${member.firstName} ${member.lastName}`,
          email: member.email,
          phoneNumber: member.phoneNumber,
          memberSince: new Date(),
          skills: JSON.stringify(data.skills),
          availability: JSON.stringify(data.availability),
          campusId: member.campusId,
          church: member.churchId,
          churchMemberId: member.id,
        });
        const newVolunteer = await this.volunteerRepository.save(volunteer);

        return {
          success: true,
          message: "A new volunteer has been added successfully",
          new_volunteer: newVolunteer,
        };
      }

      const role = await this.roleRepo.findByName("member");
      if (!role) return { success: false, message: "Role not found" };

      const memberPassword = this.generateMemberPassword();

      const newMember = MemberFactory.addMember({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: memberPassword,
        membershipStatus: "Member",
        roleId: role.id,
        addedBy: admin.id,
        campusId: admin.campusId,
        churchId: String(admin.churchId),
      });
      const addedMember = await this.memberRepository.save(newMember);

      const volunteer = VolunteerFactory.addNewVolunteer({
        name: `${addedMember.firstName} ${addedMember.lastName}`,
        email: addedMember.email,
        phoneNumber: addedMember.phoneNumber,
        memberSince: new Date(),
        skills: JSON.stringify(data.skills),
        availability: JSON.stringify(data.availability),
        campusId: addedMember.campusId,
        church: addedMember.churchId,
        churchMemberId: addedMember.id,
      });
      const newVolunteer = await this.volunteerRepository.save(volunteer);

      const emailResponse = await this.sendAccountCreationEmail(
        addedMember,
        memberPassword,
      );
      if (!emailResponse.success) return emailResponse;

      return {
        success: true,
        message:
          "A new volunteer has been added successfully and a member account has been created.",
        new_volunteer: newVolunteer,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating a new volunteer");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while creating a new volunteer",
      );
    }
  }

  private generateMemberPassword(): string {
    return generateCode(5);
  }

  private async sendAccountCreationEmail(user: any, password: string) {
    try {
      await this.sendAccountCreationMail(user, password);
      return { success: true };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error sending email");
      throw new AppError(400, "Failed to send account creation email.");
    }
  }

  private async sendAccountCreationMail(user: any, password: string) {
    const mail = {
      subject: "User Account Creation",
      name: user.firstName,
      email: user.email,
      password,
      link: process.env.FRONTEND_BASEURL + "/auth/login",
    };
    try {
      await this.mailService.sendUserAccountMail(mail);
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Error sending account creation mail",
      );
    }
  }

  async getAllVolunteerRoles(req: any) {
    const churchId = req.params.churchId;
    const { page, limit, campusId } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const filter: any = { church: churchId };
      if (campusId) {
        filter.campusId = campusId;
      }

      const { data: volunteerRoles, totalRecords } =
        await this.volunteerRoleRepository.findAndCountAll(
          filter,
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
          const volunteerRoleAssignments =
            await this.volunteerRoleAssignmentRepository.findAll({
              volunteerRoleId: role.id,
            });
          const volunteerIds = volunteerRoleAssignments.map(
            (assignment) => assignment.volunteerId,
          );
          const volunteers = await this.volunteerRepository.findAll({
            id: volunteerIds,
          });
          const volunteerRoleEvent = await this.eventRepository.findById(
            role.eventId,
          );
          return {
            ...role,
            eventName: volunteerRoleEvent
              ? volunteerRoleEvent.eventTitle
              : "Event not found",
            eventDate: volunteerRoleEvent
              ? volunteerRoleEvent.eventDate
              : "Event not found",
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
      logger.error({ error: "Error fetching volunteer roles" });
      throw new Error(
        "An unexpected error occurred while fetching volunteer roles.",
      );
    }
  }

  async getAllVolunteers(req: any) {
    const churchId = req.params.churchId;
    const { page, limit, campusId } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const filter: any = { church: churchId };
      if (campusId) {
        filter.campusId = campusId;
      }

      const { data: volunteers, totalRecords } =
        await this.volunteerRepository.findAndCountAll(
          filter,
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

      const volunteersWithRoles = await Promise.all(
        volunteers.map(async (volunteer) => {
          const volunteerRoles =
            await this.volunteerRoleAssignmentRepository.findAll({
              volunteerId: volunteer.id,
            });
          const volunteerRolesIds = volunteerRoles.map(
            (role) => role.volunteerRoleId,
          );
          const roles = await this.volunteerRoleRepository.findAll({
            id: volunteerRolesIds,
          });
          const rolesWithEvent = await Promise.all(
            roles.map(async (role) => {
              const event = await this.eventRepository.findById(role.eventId);
              return {
                ...role,
                eventName: event ? event.eventTitle : "Event not found",
                eventDate: event ? event.eventDate : "Event not found",
              };
            }),
          );
          return {
            ...volunteer,
            rolesWithEvent,
          };
        }),
      );

      const totalActiveVolunteers = volunteersWithRoles.filter(
        (volunteer) => volunteer.status === "Active",
      ).length;

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        volunteers: volunteersWithRoles,
        total_active: totalActiveVolunteers,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching volunteers" });
      throw new Error(
        "An unexpected error occurred while fetching volunteers.",
      );
    }
  }

  async assignVolunteerToRole(req: Request) {
    try {
      const [volunteer, volunteerRole] = await Promise.all([
        this.volunteerRepository.findById(req.params.volunteerId),
        this.volunteerRoleRepository.findById(req.body.volunteerRoleId),
      ]);
      if (!volunteer) throw new AppError(400, "Volunteer does not exist");
      if (!volunteerRole)
        throw new AppError(400, "Volunteer role does not exist");

      const existingAssignment =
        await this.volunteerRoleAssignmentRepository.findOne({
          volunteerId: volunteer.id,
          volunteerRoleId: volunteerRole.id,
        });
      if (existingAssignment) {
        return {
          success: false,
          message: "Volunteer is already assigned to this role",
        };
      }

      if (
        volunteerRole.noOfVolunteersNeeded ===
        volunteerRole.noOfAssignedVolunteers
      ) {
        return {
          success: false,
          message: "All volunteer slots for this role are filled",
        };
      }

      await this.volunteerRoleAssignmentRepository.save({
        volunteerId: volunteer.id,
        volunteerRoleId: volunteerRole.id,
        status: "ACTIVE",
      } as any);

      await this.volunteerRoleRepository.updateById(volunteerRole.id, {
        noOfAssignedVolunteers:
          Number(volunteerRole.noOfAssignedVolunteers) + 1,
      });

      return {
        success: true,
        message: `${volunteerRole.name} volunteer role has been successfully assigned to ${volunteer.name}`,
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Failed to assign volunteer to role",
      );
      throw new AppError(400, error.message);
    }
  }

  async removeVolunteerFromRole(req: Request) {
    try {
      const [volunteer, volunteerRole] = await Promise.all([
        this.volunteerRepository.findById(req.params.volunteerId),
        this.volunteerRoleRepository.findById(req.body.volunteerRoleId),
      ]);
      if (!volunteer) throw new AppError(400, "Volunteer does not exist");
      if (!volunteerRole)
        throw new AppError(400, "Volunteer role does not exist");

      const assignment = await this.volunteerRoleAssignmentRepository.findOne({
        volunteerId: volunteer.id,
        volunteerRoleId: volunteerRole.id,
      });
      if (!assignment) {
        throw new AppError(400, "Volunteer is not assigned to this role");
      }

      await this.volunteerRoleAssignmentRepository.deleteById(assignment.id);

      await this.volunteerRoleRepository.updateById(volunteerRole.id, {
        noOfAssignedVolunteers: Math.max(
          0,
          Number(volunteerRole.noOfAssignedVolunteers) - 1,
        ),
      });

      return {
        success: true,
        message: `${volunteer.name} has been successfully removed from ${volunteerRole.name} role`,
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Failed to remove volunteer from role",
      );
      throw new AppError(400, error.message);
    }
  }

  async changeVolunteerStatus(req: Request) {
    try {
      const { status } = req.body;

      const volunteer = await this.volunteerRepository.findById(
        req.params.volunteerId,
      );
      if (!volunteer) throw new AppError(400, "Volunteer does not exist");

      await this.volunteerRepository.updateById(volunteer.id, {
        status,
      });

      return {
        success: true,
        message: `Volunteer status has been successfully updated to ${status}`,
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Failed to change volunteer status",
      );
      throw new AppError(400, error.message);
    }
  }
}

export default VolunteerService;
