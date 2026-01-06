import { injectable } from "tsyringe";
// import { Request } from "express";
import MemberRepository from "../../memberManagement/repositories/member.repository";
import LeaveRepository from "../../leaveManagement/repositories/leave.repository";
import logger from "@shared/utils/logger";
// import AppError from "@shared/error/app.error";

@injectable()
class StaffService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly leaveRepository: LeaveRepository
  ) {}

  async getStaffMembers(req: any) {
    const churchId = req.params.churchId;
    const { page = 1, limit = 10 } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: staffMembers, totalRecords } =
        await this.memberRepository.findAndCountAll({ churchId });

      if (staffMembers.length === 0) {
        return {
          members: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        staffMembers,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error) {
      logger.error({ error: "Error fetching staff members" });
      throw new Error(
        "An unexpected error occurred while fetching staff members."
      );
    }
  }

  async getPendingLeave(req: any) {
    const churchId = req.params.churchId;
    const { page = 1, limit = 10 } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: pendingLeaves, totalRecords } =
        await this.leaveRepository.findAndCountAll({
          status: "Pending",
          church: churchId,
        });

      if (pendingLeaves.length === 0) {
        return {
          leaves: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        pendingLeaves,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching pending leaves" });
      throw new Error(
        "An unexpected error occurred while fetching pending leaves."
      );
    }
  }
}

export default StaffService;
