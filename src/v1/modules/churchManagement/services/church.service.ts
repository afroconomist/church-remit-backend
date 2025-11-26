import { injectable } from "tsyringe";
// import { Response, Request } from "express";
import { CreateChurchAndUser } from "../dtos/create-church-and-user.dto";
import ChurchFactory from "../factories/church.factory";
import UserFactory from "../../userManagement/factories/user.factory";
import ChurchRepository from "../repositories/church.repository";
import UserRepository from "../../userManagement/repositories/user.repository";
import logger from "@shared/utils/logger";
// import { ErrorResponse, SuccessResponse } from "@shared/utils/response.util";
// import httpStatus from "http-status";
// import ServiceUnavailableError from "@shared/error/service-unavailable.error";
// import { IChurch } from "../model/Church.model";
import AppError from "@shared/error/app.error";

@injectable()
class ChurchService {
  constructor(
    private readonly churchRepository: ChurchRepository,
    private readonly userRepository: UserRepository
  ) {}

  async createChurchAndUser(church_user_data: CreateChurchAndUser) {
    try {
      const existingChurch = await this.checkIfChurchExists(
        church_user_data.email
      );
      if (!existingChurch?.success) return existingChurch;

      const churchCreationResponse = await this.createChurchAndUserRecord(
        church_user_data
      );
      if (!churchCreationResponse.success) return churchCreationResponse;

      const existingUserResponse = await this.checkIfUserExists(
        String(church_user_data.userEmail)
      );
      if (!existingUserResponse?.success) return existingUserResponse;

      const userCreationResponse = await this.createChurchAndUserRecord(
        church_user_data
      );
      if (!userCreationResponse.success) return userCreationResponse;

      return {
        success: churchCreationResponse.success,
        message: "Church and user account has been created successfully",
        church_data: churchCreationResponse.church_data,
        user_data: userCreationResponse.user_data,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating church and user");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while creating the church and user"
      );
    }
  }

  private async createChurchAndUserRecord(data: CreateChurchAndUser) {
    try {
      const church = ChurchFactory.createChurch({
        churchName: data.churchName,
        churchType: data.churchType,
        email: data.churchName,
        phoneNumber: data.churchName,
        website: data.website,
        streetAddress: data.streetAddress,
        city: data.city,
        stateRegion: data.stateRegion,
        country: data.country,
        timeZone: data.timeZone,
        baseCurrency: data.baseCurrency,
        fiscalYearStart: data.fiscalYearStart,
        initialFundsToCreate: data.initialFundsToCreate,
        digitalGivingAndDonations: data.digitalGivingAndDonations,
        expenseManagement: data.expenseManagement,
        payrollManagement: data.payrollManagement,
        memberManagement: data.memberManagement,
        digitalGiving: data.digitalGiving,
        eventsAndCheckIn: data.eventsAndCheckIn,
        smallGroups: data.smallGroups,
        volunteerManagement: data.volunteerManagement,
        communications: data.communications,
        facilities: data.facilities,
        mediaLibrary: data.mediaLibrary,
      });
      const createdChurch = await this.churchRepository.save(church);

      const user = UserFactory.createUser({
        firstName: data.userFirstName,
        lastName: data.userLastName,
        email: data.userEmail,
        password: data.userPassword,
        role: data.userRole,
        churchId: createdChurch.id,
      });
      const createdUser = await this.userRepository.save(user);

      return {
        success: true,
        church_data: createdChurch,
        user_data: createdUser,
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Error creating church and user record"
      );
      throw new AppError(400, "Failed to create church and user record");
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

  async getAllChurches() {
    try {
      const { data: churches } = await this.churchRepository.getAll();

      return {
        success: true,
        message: "Church account has been created successfully",
        churches,
      };
    } catch (error) {
      logger.error({ error: "Error fetching churches," });
      throw new Error("An unexpected error occurred while fetching churches.");
    }
  }
}

export default ChurchService;
