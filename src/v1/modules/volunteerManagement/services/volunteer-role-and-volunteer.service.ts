import { injectable } from "tsyringe";
import { Request } from "express";
import { CreateVolunteerRole } from "../dtos/create-volunteer-role.dto";
import VolunteerRoleFactory from "../factories/volunteer_role.factory";
import VolunteerRoleRepository from "../repositories/volunteer_role.repo";
import VolunteerFactory from "../factories/volunteer.factory";
import VolunteerRepository from "../repositories/volunteer.repo";
import UserRepository from "../../userManagement/repositories/user.repository";
import MemberRepository from "../../memberManagement/repositories/member.repository";
import MemberFactory from "../../memberManagement/factories/member.factory";
import MailService from "../../notificationAndEmailManagement/services/mail.service";
import logger from "@shared/utils/logger";
import AppError from "@shared/error/app.error";
import RoleRepo from "../../accessControlManagement/repositories/role.repo";
import { generateCode } from "@shared/utils/functions.util";

@injectable()
class VolunteerAndRoleService {
  constructor(
    private readonly volunteerRoleRepository: VolunteerRoleRepository,
    private readonly volunteerRepository: VolunteerRepository,
    private readonly userRepository: UserRepository,
    private readonly memberRepository: MemberRepository,
    private readonly mailService: MailService,
    private readonly roleRepo: RoleRepo,
  ) {}

  async createVolunteerRoleAndShifts(
    data: CreateVolunteerRole,
    superAdminId: string,
  ) {
    try {
      const superAdmin = await this.userRepository.findById(superAdminId);
      if (!superAdmin) throw new AppError(400, "Super admin does not exist");

      const volunteerRole = VolunteerRoleFactory.createVolunteerRole({
        ...data,
        church: String(superAdmin.churchId),
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
    const superAdminId = req.user.id;

    try {
      const superAdmin = await this.userRepository.findById(superAdminId);
      if (!superAdmin) throw new AppError(400, "Super admin does not exist");

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
          church: String(superAdmin.churchId),
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
        addedBy: superAdmin.id,
        churchId: String(superAdmin.churchId),
      });
      const addedMember = await this.memberRepository.save(newMember);

      const volunteer = VolunteerFactory.addNewVolunteer({
        name: `${addedMember.firstName} ${addedMember.lastName}`,
        email: addedMember.email,
        phoneNumber: addedMember.phoneNumber,
        memberSince: new Date(),
        skills: JSON.stringify(data.skills),
        availability: JSON.stringify(data.availability),
        church: String(superAdmin.churchId),
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
        message: "A new volunteer has been added successfully",
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
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: volunteerRoles, totalRecords } =
        await this.volunteerRoleRepository.findAndCountAll(
          {
            church: churchId,
          },
          currentPage,
          pageSize,
        );

      if (volunteerRoles.length === 0) {
        return {
          members: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        volunteerRoles,
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
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: volunteers, totalRecords } =
        await this.volunteerRepository.findAndCountAll(
          {
            church: churchId,
          },
          currentPage,
          pageSize,
        );

      if (volunteers.length === 0) {
        return {
          members: [],
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
      logger.error({ error: "Error fetching volunteers" });
      throw new Error(
        "An unexpected error occurred while fetching volunteers.",
      );
    }
  }

  async assignVolunteerToRole(req: Request) {
    try {
      const volunteer = await this.volunteerRepository.findById(
        req.params.volunteerId,
      );
      if (!volunteer) throw new AppError(400, "Volunteer does not exist");

      const volunteerRole = await this.volunteerRoleRepository.findById(
        req.body.volunteerRoleId,
      );
      if (!volunteerRole)
        throw new AppError(400, "Volunteer role does not exist");

      await this.volunteerRepository.updateById(volunteer.id, {
        volunteerRoleName: volunteerRole.name,
        section: volunteerRole.section,
        volunteerRole: volunteerRole.id,
      });

      await this.volunteerRoleRepository.updateById(volunteerRole.id, {
        noOfVolunteersNeeded: volunteerRole.noOfVolunteersNeeded - 1,
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
}

export default VolunteerAndRoleService;
