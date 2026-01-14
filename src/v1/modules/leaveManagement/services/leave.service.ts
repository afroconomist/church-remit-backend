import { injectable } from "tsyringe";
import { Request } from "express";
import { SubmitLeaveRequest } from "../dtos/submit-leave-request.dto";
import LeaveFactory from "../fatories/leave.factory";
import LeaveRepository from "../repositories/leave.repository";
import MemberRepository from "../../memberManagement/repositories/member.repository";
// import MailService from "../../userManagement/services/mail.service";
import logger from "@shared/utils/logger";
import AppError from "@shared/error/app.error";
import {
  normalizeDate,
  calculateLeaveDays,
} from "@shared/utils/functions.util";

@injectable()
class LeaveService {
  constructor(
    private readonly leaveRepository: LeaveRepository,
    private readonly memberRepository: MemberRepository // private readonly mailService: MailService
  ) {}

  async submitLeaveRequest(leave_data: SubmitLeaveRequest, staff: string) {
    try {
      const staffExists = await this.memberRepository.findById(staff);
      if (!staffExists) throw new AppError(400, "Staff does not exist");

      const startDate = new Date(leave_data.startDate);
      const endDate = new Date(leave_data.endDate);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Invalid start or end date");
      }
      if (endDate < startDate) {
        throw new Error("End date cannot be before start date");
      }

      const today = normalizeDate(new Date());
      const normalizedStart = normalizeDate(startDate);
      if (normalizedStart < today) {
        throw new Error("You cannot request leave in the past");
      }

      const calculatedDays = calculateLeaveDays(startDate, endDate);
      if (leave_data.totalDays !== calculatedDays) {
        throw new Error(`Total days mismatch. Expected ${calculatedDays}`);
      }

      const leave = LeaveFactory.submitLeaveRequest({
        ...leave_data,
        staffName: `${staffExists.firstName} ${staffExists.lastName}`,
        submittedAt: new Date(),
        memberId: staffExists.id,
        church: staffExists.churchId,
      });
      const submittedLeaveRequest = await this.leaveRepository.save(leave);

      return {
        success: true,
        message: "Leave request has been submitted successfully",
        leave: submittedLeaveRequest,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error submitting leave request");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while submitting leave request"
      );
    }
  }

  async approveLeaveRequest(req: Request) {
    try {
      const submittedLeave = await this.leaveRepository.findById(
        req.params.leaveId
      );
      if (!submittedLeave) throw new AppError(400, "Leave request not found");

      await this.leaveRepository.updateById(submittedLeave.id, {
        status: "Approved",
        approvedBy: "Super Admin",
        approvedAt: new Date(),
      });

      return {
        success: true,
        message: "Leave request has been approved",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error approving leave request");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while approving leave request"
      );
    }
  }

  async rejectLeaveRequest(req: Request) {
    try {
      const submittedLeave = await this.leaveRepository.findById(
        req.params.leaveId
      );
      if (!submittedLeave) throw new AppError(400, "Leave request not found");

      await this.leaveRepository.updateById(submittedLeave.id, {
        status: "Rejected",
      });

      return {
        success: true,
        message: "Leave request has been rejected",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error rejecting leave request");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while rejecting leave request"
      );
    }
  }

  async getLeavesBasedOnStatus(req: any) {
    const churchId = req.params.churchId;
    const { status, page = 1, limit = 10 } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: leavesBasedOnStatus, totalRecords } =
        await this.leaveRepository.findAndCountAll({
          status,
          church: churchId,
        });

      if (leavesBasedOnStatus.length === 0) {
        return {
          leaves: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        leavesBasedOnStatus,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching leaves based on status" });
      throw new Error(
        "An unexpected error occurred while fetching leaves based on status."
      );
    }
  }
}

export default LeaveService;
