import { injectable } from "tsyringe";
import ChurchFactory from "../factories/church.factory";
import UserFactory from "../../userManagement/factories/user.factory";
import ChurchRepository from "../repositories/church.repository";
import UserRepository from "../../userManagement/repositories/user.repository";
import MemberRepository from "../../memberManagement/repositories/member.repository";
import RoleRepo from "../../accessControlManagement/repositories/role.repo";
import OTPService from "../../auth/services/otp.service";
import MailService from "../../notificationAndEmailManagement/services/mail.service";
import logger from "@shared/utils/logger";
import { generateCode } from "@shared/utils/functions.util";
import AppError from "@shared/error/app.error";
import { transaction } from "objection";
import { Church } from "../model/church.model";

interface OnboardingPayload {
  churchName: string;
  churchType: string;
  email: string;
  phoneNumber: string;
  website: string | null;
  streetAddress: string;
  city: string;
  stateRegion: string;
  country: string;
  timeZone: string;
  baseCurrency: string;
  fiscalYearStart: Date;
  initialFundsToCreate: string[] | string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userPassword: string;
  churchId: string;
}
@injectable()
class ChurchService {
  constructor(
    private readonly churchRepository: ChurchRepository,
    private readonly userRepository: UserRepository,
    private readonly memberRepository: MemberRepository,
    private readonly otpService: OTPService,
    private readonly mailService: MailService,
    private readonly roleRepo: RoleRepo,
  ) {}

  async createChurchAndUser(church_user_data: OnboardingPayload) {
    try {
      const accountExists = await this.memberRepository.findOne({
        email: church_user_data.userEmail,
      });
      if (accountExists)
        return {
          success: false,
          message: "Account already exists with this email",
        };

      const existingChurchResponse = await this.checkIfChurchExists(
        church_user_data.email,
      );
      if (!existingChurchResponse?.success) return existingChurchResponse;

      const existingUserResponse = await this.checkIfUserExists(
        String(church_user_data.userEmail),
      );
      if (!existingUserResponse?.success) return existingUserResponse;

      const role = await this.roleRepo.findByName("super-admin");
      if (!role) return { success: false, message: "Role not found" };

      const { createdChurch, createdUser } = await transaction(
        Church.knex(),
        async (trx) => {
          const church = ChurchFactory.createChurch({
            churchName: church_user_data.churchName,
            churchType: church_user_data.churchType,
            email: church_user_data.email,
            phoneNumber: church_user_data.phoneNumber,
            website: church_user_data.website,
            streetAddress: church_user_data.streetAddress,
            city: church_user_data.city,
            stateRegion: church_user_data.stateRegion,
            country: church_user_data.country,
            timeZone: church_user_data.timeZone,
            baseCurrency: church_user_data.baseCurrency,
            fiscalYearStart: church_user_data.fiscalYearStart,
            initialFundsToCreate: JSON.stringify(
              church_user_data.initialFundsToCreate,
            ),
          });
          const createdChurch = await this.churchRepository.save(church, trx);

          const user = UserFactory.createUser({
            firstName: church_user_data.userFirstName,
            lastName: church_user_data.userLastName,
            email: church_user_data.userEmail,
            password: church_user_data.userPassword,
            roleId: role.id,
            isDefaultPassword: false,
            churchId: createdChurch.id,
          });
          const createdUser = await this.userRepository.save(user, trx);

          return { createdChurch, createdUser };
        },
      );

      const token = generateCode(6);
      await this.otpService.sendOTP({
        userId: createdUser.id,
        token,
        otpType: "account-verification",
      });

      const options = {
        name: createdUser.firstName,
        email: createdUser.email,
        otp: token,
        subject: "Account Verification",
      };
      this.mailService.sendOTPMail(options);

      const { password, ...newUser } = createdUser;
      return {
        success: true,
        message: "Church and user account has been created successfully",
        otp_message: `Kindly check your email address ${newUser.email} for OTP`,
        church_data: createdChurch,
        user_data: newUser,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating church and user");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while creating the church and user",
      );
    }
  }

  private async checkExistingChurch(email: string) {
    return await this.churchRepository.findOne({ email });
  }

  private async checkIfChurchExists(email: string) {
    const existingChurch = await this.checkExistingChurch(email);
    if (existingChurch) {
      throw new AppError(400, "Church already exists with this email");
    }
    return { success: true };
  }

  private async checkExistingUser(email: string) {
    return await this.userRepository.findOne({ email });
  }

  private async checkIfUserExists(email: string) {
    const existingUser = await this.checkExistingUser(email);
    if (existingUser) {
      throw new AppError(400, "User already exists with this email");
    }
    return { success: true };
  }

  async getAllChurches(req: any) {
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: churches, totalRecords } =
        await this.churchRepository.getAndCountAll(currentPage, pageSize);

      if (churches.length === 0) {
        return {
          churches: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churches,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error) {
      logger.error({ error: "Error fetching churches" });
      throw new Error("An unexpected error occurred while fetching churches.");
    }
  }

  async getChurchesBasedOnTypes(req: any) {
    const churchType = req.params.churchType;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: churchesBasedOnTypes, totalRecords } =
        await this.churchRepository.findAndCountAll(
          {
            churchType,
          },
          currentPage,
          pageSize,
        );

      if (churchesBasedOnTypes.length === 0) {
        return {
          churches: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchesBasedOnTypes,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error) {
      logger.error({ error: "Error fetching churches based on types" });
      throw new Error(
        "An unexpected error occurred while fetching churches based on types.",
      );
    }
  }

  async getVerifiedChurches(req: any) {
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: verifiedChurches, totalRecords } =
        await this.churchRepository.findAndCountAll(
          {
            verified: true,
          },
          currentPage,
          pageSize,
        );

      if (verifiedChurches.length === 0) {
        return {
          verifiedChurches: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        verifiedChurches,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error) {
      logger.error({ error: "Error fetching verified churches" });
      throw new Error(
        "An unexpected error occurred while fetching verified churches.",
      );
    }
  }

  async getChurchMembers(req: any) {
    const churchId = req.params.churchId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: churchMembers, totalRecords } =
        await this.memberRepository.findAndCountAll({ churchId }, currentPage, pageSize);

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
      logger.error({ error: "Error fetching church members" });
      throw new Error(
        "An unexpected error occurred while fetching church members.",
      );
    }
  }

  async getChurch(churchId: string) {
    const church = await this.churchRepository.findById(churchId);
    if (!church) throw new AppError(400, "Church does not exist");

    return { success: true, church };
  }

  async editChurch(req: any) {
    try {
      const data = req.body;
      const church = await this.churchRepository.findById(req.params.churchId);
      if (!church) throw new AppError(400, "Church does not exist");

      await this.churchRepository.updateById(church.id, {
        churchName: data.churchName,
        churchType: data.churchType,
        email: data.email,
        phoneNumber: data.phoneNumber,
        website: data.website,
        streetAddress: data.streetAddress,
        city: data.city,
        stateRegion: data.stateRegion,
        country: data.country,
        timeZone: data.timeZone,
        baseCurrency: data.baseCurrency,
        fiscalYearStart: data.fiscalYearStart,
        initialFundsToCreate: JSON.stringify(data.initialFundsToCreate),
      });

      return {
        success: true,
        message: "Church info has been updated successfully",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to edit church");
      throw new AppError(400, error.message);
    }
  }
}

export default ChurchService;
