import { injectable } from "tsyringe";
// import { Request } from "express";
import PrayerFactory from "../factories/prayer.factory";
import PrayerRepository from "../repositories/prayer.repository";
import PrayerWarriorFactory from "../factories/prayer_warrior.factory";
import PrayerWarriorRepository from "../repositories/prayer_warrior.repository";
import UserRepository from "../../userManagement/repositories/user.repository";
import MemberRepository from "../../memberManagement/repositories/member.repository";
import { SubmitPrayerRequest } from "../dtos/submit-prayer-request.dto";
import { AddPrayerWarrior } from "../dtos/add-prayer-warrior.dto";
import logger from "@shared/utils/logger";
import AppError from "@shared/error/app.error";

@injectable()
class PrayerAndWarriorService {
  constructor(
    private readonly prayerRepository: PrayerRepository,
    private readonly prayerWarriorRepository: PrayerWarriorRepository,
    private readonly userRepository: UserRepository,
    private readonly memberRepository: MemberRepository
  ) {}

  async submitPrayerRequest(data: SubmitPrayerRequest, memberId: string) {
    try {
      const member = await this.memberRepository.findById(memberId);
      if (!member) throw new AppError(400, "Member does not exist");

      if (
        data.privacySetting === "Public" ||
        data.privacySetting === "Private"
      ) {
        const prayerRequest = PrayerFactory.submitPrayerRequest({
          requestTitle: data.requestTitle,
          description: data.description,
          category: data.category,
          urgency: data.urgency,
          privacySetting: data.privacySetting,
          submittedBy: `${member.firstName} ${member.lastName}`,
          church: member.churchId,
        });
        const submittedPrayerRequest = await this.prayerRepository.save(
          prayerRequest
        );

        return {
          success: true,
          message: "Prayer request has been submitted successfully",
          prayerRequest: submittedPrayerRequest,
        };
      }

      const prayerRequest = PrayerFactory.submitPrayerRequest({
        requestTitle: data.requestTitle,
        description: data.description,
        category: data.category,
        urgency: data.urgency,
        privacySetting: data.privacySetting,
        church: member.churchId,
      });
      const submittedPrayerRequest = await this.prayerRepository.save(
        prayerRequest
      );

      return {
        success: true,
        message: "Prayer request has been submitted successfully",
        prayerRequest: submittedPrayerRequest,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error submitting prayer request");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while submitting prayer request"
      );
    }
  }

  async addPrayerWarrior(data: AddPrayerWarrior, superAdminId: string) {
    try {
      const superAdmin = await this.userRepository.findById(superAdminId);
      if (!superAdmin) throw new AppError(400, "Super admin does not exist");

      const prayerWarrior = PrayerWarriorFactory.addPrayerWarrior({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        church: String(superAdmin.churchId),
      });
      const addedPrayerWarrior = await this.prayerWarriorRepository.save(
        prayerWarrior
      );

      return {
        success: true,
        message: "Prayer warrior has been added successfully",
        prayerWarrior: addedPrayerWarrior,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error adding prayer warrior");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while adding prayer warrior"
      );
    }
  }

  async getAllPrayerRequests(req: any) {
    const churchId = req.params.churchId;
    const { page = 1, limit = 10 } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: prayerRequests, totalRecords } =
        await this.prayerRepository.findAndCountAll({
          church: churchId,
        });

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
      logger.error({ error: "Error fetching prayer requests" });
      throw new Error(
        "An unexpected error occurred while fetching prayer requests."
      );
    }
  }

  async getPrayerWarriors(req: any) {
    const churchId = req.params.churchId;
    const { page = 1, limit = 10 } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: prayerWarriors, totalRecords } =
        await this.prayerWarriorRepository.findAndCountAll({
          church: churchId,
        });

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
      logger.error({ error: "Error fetching prayer warriors" });
      throw new Error(
        "An unexpected error occurred while fetching prayer warriors."
      );
    }
  }

  async assignPrayerToWarrior(req: any) {
    try {
      const prayerWarrior = await this.prayerWarriorRepository.findById(
        req.body.prayerWarriorId
      );
      if (!prayerWarrior)
        throw new AppError(400, "Prayer warrior does not exist");

      const prayerRequest = await this.prayerRepository.findById(
        req.body.prayerRequestId
      );
      if (!prayerRequest)
        throw new AppError(400, "Prayer request does not exist");

      await this.prayerRepository.updateById(prayerRequest.id, {
        assignedTo: prayerWarrior.name,
        prayerWarrior: prayerWarrior.id,
      });

      await this.prayerWarriorRepository.updateById(prayerWarrior.id, {
        assigned: Number(prayerWarrior.assigned) + 1,
      });

      return {
        success: true,
        message: `Prayer request has been assigned to ${prayerWarrior.name}`,
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Failed to assign prayer request to prayer warrior"
      );
      throw new AppError(400, error.message);
    }
  }

  async getPrayerWarriorAssignments(req: any) {
    const prayerWarriorId = req.params.prayerWarriorId;
    const { page = 1, limit = 10 } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: prayerWarriorAssignments, totalRecords } =
        await this.prayerRepository.findAndCountAll({
          prayerWarrior: prayerWarriorId,
        });

      if (prayerWarriorAssignments.length === 0) {
        return {
          prayerWarriorAssignments: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        prayerWarriorAssignments,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error) {
      logger.error({ error: "Error fetching prayer warrior assignments" });
      throw new Error(
        "An unexpected error occurred while fetching prayer warrior assignments."
      );
    }
  }

  async markPrayerAnswered(prayerRequestId: string) {
    try {
      const prayerRequest = await this.prayerRepository.findById(
        prayerRequestId
      );
      if (!prayerRequest)
        throw new AppError(400, "Prayer request does not exist");

      const prayerWarrior = await this.prayerWarriorRepository.findById(
        String(prayerRequest.prayerWarrior)
      );
      if (!prayerWarrior)
        throw new AppError(400, "Prayer warrior does not exist");

      await this.prayerRepository.updateById(prayerRequest.id, {
        answered: true,
      });

      await this.prayerWarriorRepository.updateById(prayerWarrior.id, {
        completed: Number(prayerWarrior.completed) + 1,
      });

      return {
        success: true,
        message: "Prayer request has been marked answered",
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Failed to mark prayer request answered"
      );
      throw new AppError(400, error.message);
    }
  }

  async prayOnPrayerRequests(prayerRequestId: string) {
    try {
      const prayerRequest = await this.prayerRepository.findById(
        prayerRequestId
      );
      if (!prayerRequest)
        throw new AppError(400, "Prayer request does not exist");

      await this.prayerRepository.updateById(prayerRequest.id, {
        pray: Number(prayerRequest.pray) + 1,
      });

      return {
        success: true,
        message: "Prayer request has been prayed on",
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Failed to pray on prayer request"
      );
      throw new AppError(400, error.message);
    }
  }
}

export default PrayerAndWarriorService;
