import { injectable } from "tsyringe";
import CampusFactory from "../factories/campus.factory";
import CampusRepository from "../repositories/campus.repository";
import CampusPersonnelFactory from "../factories/campus_personnel.factory";
import CampusPersonnelRepository from "../repositories/campus_personnel.repository";
import UserRepository from "../../userManagement/repositories/user.repository";
import MemberRepository from "../../memberManagement/repositories/member.repository";
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
        await this.campusRepository.findAndCountAll({ churchId }, page, limit);

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
          page,
          limit,
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
}

export default CampusService;
