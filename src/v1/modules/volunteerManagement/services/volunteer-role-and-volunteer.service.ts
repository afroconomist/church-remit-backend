import { injectable } from "tsyringe";
import { Request } from "express";
import { CreateVolunteerRole } from "../dtos/create-volunteer-role.dto";
import { AddNewVolunteer } from "../dtos/add-new-volunteer.dto";
import VolunteerRoleFactory from "../factories/volunteer_role.factory";
import VolunteerRoleRepository from "../repositories/volunteer_role.repo";
import VolunteerFactory from "../factories/volunteer.factory";
import VolunteerRepository from "../repositories/volunteer.repo";
import UserRepository from "../../userManagement/repositories/user.repository";
import logger from "@shared/utils/logger";
import AppError from "@shared/error/app.error";

@injectable()
class VolunteerAndRoleService {
  constructor(
    private readonly volunteerRoleRepository: VolunteerRoleRepository,
    private readonly volunteerRepository: VolunteerRepository,
    private readonly userRepository: UserRepository
  ) {}

  async createVolunteerRoleAndShifts(
    data: CreateVolunteerRole,
    superAdminId: string
  ) {
    try {
      const superAdmin = await this.userRepository.findById(superAdminId);
      if (!superAdmin) throw new AppError(400, "Super admin does not exist");

      const volunteerRole = VolunteerRoleFactory.createVolunteerRole({
        ...data,
        church: String(superAdmin.churchId),
      });
      const newVolunteerRole = await this.volunteerRoleRepository.save(
        volunteerRole
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
          "An unexpected error occurred while creating a volunteer role"
      );
    }
  }

  async addNewVolunteer(data: AddNewVolunteer, superAdminId: string) {
    try {
      const superAdmin = await this.userRepository.findById(superAdminId);
      if (!superAdmin) throw new AppError(400, "Super admin does not exist");

      const volunteer = VolunteerFactory.addNewVolunteer({
        ...data,
        skills: JSON.stringify(data.skills),
        availability: JSON.stringify(data.availability),
        church: String(superAdmin.churchId),
      });
      const newVolunteer = await this.volunteerRepository.save(volunteer);

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
          "An unexpected error occurred while creating a new volunteer"
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
        await this.volunteerRoleRepository.findAndCountAll({
          church: churchId,
        }, page, limit);

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
        "An unexpected error occurred while fetching volunteer roles."
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
        await this.volunteerRepository.findAndCountAll({
          church: churchId,
        }, page, limit);

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
        "An unexpected error occurred while fetching volunteers."
      );
    }
  }

  async assignVolunteerToRole(req: Request) {
    try {
      const volunteer = await this.volunteerRepository.findById(
        req.params.volunteerId
      );
      if (!volunteer) throw new AppError(400, "Volunteer does not exist");

      const volunteerRole = await this.volunteerRoleRepository.findById(
        req.body.volunteerRoleId
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
        "Failed to assign volunteer to role"
      );
      throw new AppError(400, error.message);
    }
  }
}

export default VolunteerAndRoleService;
