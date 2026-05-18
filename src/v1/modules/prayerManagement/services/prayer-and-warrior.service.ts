import { injectable } from "tsyringe";
import PrayerFactory from "../factories/prayer_request.factory";
import PrayerRepository from "../repositories/prayer_request.repository";
import PrayerRequestCommentRepository from "../repositories/prayer_request_comment.repository";
import TestimonyRepository from "../repositories/testimony.repository";
import PrayerWarriorFactory from "../factories/prayer_warrior.factory";
import PrayerWarriorRepository from "../repositories/prayer_warrior.repository";
import UserRepository from "../../userManagement/repositories/user.repository";
import MemberRepository from "../../memberManagement/repositories/member.repository";
import { SubmitPrayerRequest } from "../dtos/submit-prayer-request.dto";
import logger from "@shared/utils/logger";
import AppError from "@shared/error/app.error";

@injectable()
class PrayerAndWarriorService {
  constructor(
    private readonly prayerRepository: PrayerRepository,
    private readonly prayerRequestCommentRepository: PrayerRequestCommentRepository,
    private readonly testimonyRepository: TestimonyRepository,
    private readonly prayerWarriorRepository: PrayerWarriorRepository,
    private readonly userRepository: UserRepository,
    private readonly memberRepository: MemberRepository,
  ) {}

  async submitPrayerRequest(data: SubmitPrayerRequest, memberId: string) {
    try {
      const member = await this.userRepository.findById(memberId);
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
          church: String(member.churchId),
        });
        const submittedPrayerRequest = await this.prayerRepository.save(
          prayerRequest,
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
        church: String(member.churchId),
      });
      const submittedPrayerRequest = await this.prayerRepository.save(
        prayerRequest,
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
          "An unexpected error occurred while submitting prayer request",
      );
    }
  }

  async addPrayerWarrior(req: any) {
    try {
      const superAdmin = await this.userRepository.findById(req.user.id);
      if (!superAdmin) throw new AppError(400, "Super admin does not exist");

      const member = await this.memberRepository.findById(req.body.memberId);
      if (!member) throw new AppError(400, "Member does not exist");

      const prayerWarriorExists = await this.prayerWarriorRepository.findOne({
        memberId: member.id,
      });
      if (prayerWarriorExists)
        return {
          success: false,
          message: "Member is already a prayer warrior",
        };

      const prayerWarrior = PrayerWarriorFactory.addPrayerWarrior({
        name: `${member.firstName} ${member.lastName}`,
        email: member.email,
        phoneNumber: member.phoneNumber,
        church: String(superAdmin.churchId),
      });
      const addedPrayerWarrior = await this.prayerWarriorRepository.save(
        prayerWarrior,
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
          "An unexpected error occurred while adding prayer warrior",
      );
    }
  }

  async getAllPrayerRequests(req: any) {
    const churchId = req.params.churchId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: prayerRequests, totalRecords } =
        await this.prayerRepository.findAndCountAll(
          {
            church: churchId,
          },
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
      logger.error({ error: "Error fetching prayer requests" });
      throw new Error(
        "An unexpected error occurred while fetching prayer requests.",
      );
    }
  }

  async getPrayerWarriors(req: any) {
    const churchId = req.params.churchId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: prayerWarriors, totalRecords } =
        await this.prayerWarriorRepository.findAndCountAll(
          {
            church: churchId,
          },
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
      logger.error({ error: "Error fetching prayer warriors" });
      throw new Error(
        "An unexpected error occurred while fetching prayer warriors.",
      );
    }
  }

  async assignPrayerToWarrior(req: any) {
    try {
      const prayerWarrior = await this.prayerWarriorRepository.findById(
        req.body.prayerWarriorId,
      );
      if (!prayerWarrior)
        throw new AppError(400, "Prayer warrior does not exist");

      const prayerRequest = await this.prayerRepository.findById(
        req.body.prayerRequestId,
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
        "Failed to assign prayer request to prayer warrior",
      );
      throw new AppError(400, error.message);
    }
  }

  async getPrayerWarriorAssignments(req: any) {
    const prayerWarriorId = req.params.prayerWarriorId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: prayerWarriorAssignments, totalRecords } =
        await this.prayerRepository.findAndCountAll(
          {
            prayerWarrior: prayerWarriorId,
          },
          currentPage,
          pageSize,
        );

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
        "An unexpected error occurred while fetching prayer warrior assignments.",
      );
    }
  }

  async markPrayerAnswered(prayerRequestId: string) {
    try {
      const prayerRequest = await this.prayerRepository.findById(
        prayerRequestId,
      );
      if (!prayerRequest)
        throw new AppError(400, "Prayer request does not exist");

      const prayerWarrior = await this.prayerWarriorRepository.findById(
        String(prayerRequest.prayerWarrior),
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
        "Failed to mark prayer request answered",
      );
      throw new AppError(400, error.message);
    }
  }

  async prayOnPrayerRequests(prayerRequestId: string) {
    try {
      const prayerRequest = await this.prayerRepository.findById(
        prayerRequestId,
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
        "Failed to pray on prayer request",
      );
      throw new AppError(400, error.message);
    }
  }

  async commentOnPrayerRequest(
    prayerRequestId: string,
    message: string,
    userId: string,
  ) {
    try {
      const prayerRequest = await this.prayerRepository.findById(
        prayerRequestId,
      );
      if (!prayerRequest)
        throw new AppError(404, "Prayer request does not exist");

      const [member, admin] = await Promise.all([
        this.memberRepository.findById(userId),
        this.userRepository.findById(userId),
      ]);
      let prayerWarrior;
      if (member) {
        prayerWarrior = await this.prayerWarriorRepository.findOne({
          churchMemberId: member.id,
        });
      }
      let user;
      if (member || admin) {
        user = member || admin;
      }

      let commentedByName;
      if (user) {
        commentedByName = `${user.firstName} ${user.lastName}`;
      } else if (prayerWarrior) {
        commentedByName = prayerWarrior.name;
      }

      const comment = await this.prayerRequestCommentRepository.save({
        prayerRequestId,
        message,
        commentedBy: commentedByName,
      });

      return {
        success: true,
        comment,
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Error commenting on prayer request",
      );
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while commenting on prayer request",
      );
    }
  }

  async getCommentsOnPrayerRequest(req: any) {
    const prayerRequestId = req.params.prayerRequestId;

    try {
      const prayerRequest = await this.prayerRepository.findById(
        prayerRequestId,
      );
      if (!prayerRequest)
        throw new AppError(404, "Prayer request does not exist");

      const comments = await this.prayerRequestCommentRepository.findAll({
        prayerRequestId: prayerRequest.id,
      });

      return {
        success: true,
        message: "Comments fetched successfully",
        comments,
      };
    } catch (error) {
      logger.error({ error: "Error fetching prayer request comments" });
      throw new Error(
        "An unexpected error occurred while fetching prayer request comments.",
      );
    }
  }

  async deleteCommentOnPrayerRequest(commentId: string) {
    const comment = await this.prayerRequestCommentRepository.findById(
      commentId,
    );
    if (!comment) throw new AppError(404, "Comment does not exist");

    await this.prayerRequestCommentRepository.deleteById(commentId);

    return "Comment has been deleted successfully";
  }

  async createTestimony(req: any) {
    try {
      const [admin, member] = await Promise.all([
        this.userRepository.findById(req.user.id),
        this.memberRepository.findById(req.user.id),
      ]);
      if (!admin && !member) throw new AppError(404, "User does not exist");

      const memberName = member
        ? `${member.firstName} ${member.lastName}`
        : `${admin.firstName} ${admin.lastName}`;
      const churchId = member ? member.churchId : admin.churchId;

      const testimony = await this.testimonyRepository.save({
        testimony: req.body.testimony,
        memberName,
        churchId: String(churchId),
      });

      return {
        success: true,
        message: "Testimony has been created successfully",
        testimony,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating testimony");
      throw new AppError(
        error.statusCode || 400,
        error.message ||
          "An unexpected error occurred while creating testimony",
      );
    }
  }
}

export default PrayerAndWarriorService;
