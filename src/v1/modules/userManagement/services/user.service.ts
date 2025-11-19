import { injectable } from "tsyringe";
import { Response, Request } from "express";
import { CreateUser } from "../dtos/create-user.dto";
import UserFactory from "../factories/user.factory";
import UserRepository from "../repositories/user.repository";
import { exportCSVData, generateCode } from "@shared/utils/functions.util";
import MailService from "./mail.service";
import logger from "@shared/utils/logger";
import { ErrorResponse, SuccessResponse } from "@shared/utils/response.util";
import httpStatus from "http-status";
import ServiceUnavailableError from "@shared/error/service-unavailable.error";
import { IUser } from "../model/user.model";
import WalletService from "./wallet.service";
import WalletRepository from "../repositories/wallet.repository";
import AppError from "@shared/error/app.error";
import { QueueService } from "../queues/wallet-creation.queue";
import IdVerificationRepository from "../repositories/id_verification.repository";
import ActionReasonFactory from "../factories/action_reason.factory";
import { uploadMultipart } from "@shared/external-services/media-upload/media-upload.service";
import path from "path";
import appConfig from "@config/app.config";
import ReasonRepository from "../repositories/reason.repository";
import AccessControlManagementService from "../../accessControlManagement/services/access-control-management.service";
import RoleRepo from "../../accessControlManagement/repositories/role.repo";
@injectable()
class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
    private readonly walletService: WalletService,
    private readonly walletRepository: WalletRepository,
    private readonly queueService: QueueService,
    private readonly idVerificationRepository: IdVerificationRepository,
    private readonly reasonRepository: ReasonRepository,
    private readonly accessControlManagementService: AccessControlManagementService,
    private readonly roleRepo: RoleRepo
  ) {}

  async createUser(data: CreateUser, userId: string) {
    try {
      const existingUserResponse = await this.checkIfUserExists(data.email);
      if (!existingUserResponse?.success) return existingUserResponse;

      const supervisorResponse = await this.checkSupervisorExistence(
        data.supervisorId ?? ""
      );
      if (!supervisorResponse.success) return supervisorResponse;

      const password = this.generateUserPassword();
      data.password = password;
      data.addedBy = userId;

      const userCreationResponse = await this.createUserRecord(data);
      if (!userCreationResponse.success) return userCreationResponse;

      const emailResponse = await this.sendAccountCreationEmail(
        userCreationResponse.data!,
        password
      );
      if (!emailResponse.success) return emailResponse;

      return {
        success: true,
        message: "User account has been created successfully",
        data: userCreationResponse.data,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating user");
      throw new AppError(
        400,
        error.message || "An unexpected error occurred while creating the user"
      );
    }
  }

  private generateUserPassword(): string {
    return generateCode(5);
  }

  private async checkExistingUser(email: string) {
    return await this.userRepository.findOne({ email });
  }

  async checkSupervisorExistence(supervisorId: string) {
    const supervisor = await this.validateSupervisor(supervisorId);
    if (!supervisor) {
      throw new AppError(400, "Supervisor does not exist");
    }
    return { success: true };
  }

  private async checkIfUserExists(email: string) {
    const existingUser = await this.checkExistingUser(email);
    if (existingUser) {
      throw new AppError(400, "User already exists with this email");
    }
    return { success: true };
  }

  private async validateSupervisor(supervisorId: string) {
    return await this.userRepository.findOrWhereQuery({ id: supervisorId });
  }

  private async createUserRecord(data: CreateUser) {
    try {
      const user = UserFactory.createUser(data);
      const createdUser = await this.userRepository.save(user);
      await this.queueService.addWalletCreationJob(createdUser);
      return { success: true, data: createdUser };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating user record");
      throw new AppError(400, "Failed to create user record");
    }
  }

  async uploadBulkUsers(req: any) {
    const users = req.body;
    const notAdded: any[] = [];
    const added: any[] = [];
    let addedBy = req.user.id;

    try {
      const existingUsersMap = await this.getExistingUsers(users);
      const supervisorsMap = await this.getSupervisors(users);
      const { userDataArray, mailDataArray } = this.processUsers(
        users,
        existingUsersMap,
        supervisorsMap,
        added,
        notAdded,
        addedBy
      );

      const savedUsers = await this.saveUsers(userDataArray);
      await this.queueService.addBulkWalletCreationJobs(savedUsers);
      await this.sendNotificationEmails(mailDataArray);

      return {
        success: true,
        message: "User upload successful",
        data: { added, notAdded },
      };
    } catch (error: any) {
      logger.error(
        { error: JSON.stringify(error) },
        "UserSerivce [BulkUserOnboarding]: Error Creating User"
      );
    }
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

  private async getExistingUsers(users: any[]): Promise<Map<string, any>> {
    const emails = users.map((user) => user.email);
    return await this.getExistingUsersMap(emails);
  }

  private async getSupervisors(users: any[]): Promise<Map<string, any>> {
    const supervisorIds = Array.from(
      new Set(users.map((user) => user.supervisorId))
    );
    return await this.getSupervisorsMap(supervisorIds);
  }

  private processUsers(
    users: any[],
    existingUsersMap: Map<string, any>,
    supervisorsMap: Map<string, any>,
    added: any[],
    notAdded: any[],
    addedBy: string
  ) {
    const userDataArray: IUser[] = [];
    const mailDataArray: {
      subject: string;
      name: string;
      email: string;
      password: string;
      link: string;
    }[] = [];

    users.forEach((user) => {
      if (this.isExistingUser(user, existingUsersMap, notAdded)) return;
      if (!this.hasValidSupervisor(user, supervisorsMap, notAdded)) return;

      const password = generateCode(5);
      user.addedBy = addedBy;
      this.addUserAndMailData(
        user,
        password,
        userDataArray,
        mailDataArray,
        added,
        notAdded
      );
    });

    return { userDataArray, mailDataArray };
  }

  private isExistingUser(
    user: any,
    existingUsersMap: Map<string, any>,
    notAdded: any[]
  ): boolean {
    if (existingUsersMap.has(user.email)) {
      notAdded.push({
        email: user.email,
        reason: "Account with this email already exists",
      });
      return true;
    }
    return false;
  }

  private hasValidSupervisor(
    user: any,
    supervisorsMap: Map<string, any>,
    notAdded: any[]
  ): boolean {
    const supervisor = supervisorsMap.get(user.supervisorId);
    if (!supervisor) {
      notAdded.push({ email: user.email, reason: "Supervisor does not exist" });
      return false;
    }
    return true;
  }

  private addUserAndMailData(
    user: any,
    password: string,
    userDataArray: IUser[],
    mailDataArray: any[],
    added: any[],
    notAdded: any[]
  ) {
    try {
      const newUser = UserFactory.createUser(
        this.createUserData(user, password)
      );
      userDataArray.push(newUser);
      mailDataArray.push({
        subject: "User Account Creation",
        name: user.name,
        email: user.email,
        password: password,
        link: `${process.env.FRONTEND_BASEURL}/login`,
      });

      added.push({ email: user.email, status: "User created successfully" });
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating user");
      notAdded.push({ email: user.email, reason: `Error: ${error.message}` });
    }
  }

  private async saveUsers(userDataArray: IUser[]): Promise<IUser[]> {
    if (userDataArray.length) {
      return await this.userRepository.saveMany(userDataArray);
    }
    return [];
  }

  private async sendNotificationEmails(mailDataArray: any[]): Promise<void> {
    if (mailDataArray.length)
      await this.mailService.sendBulkUserAccountMail(mailDataArray);
  }

  private async getExistingUsersMap(
    emails: string[]
  ): Promise<Map<string, any>> {
    const existingUsers = await this.userRepository.findByEmails(emails);
    return new Map(existingUsers.map((user) => [user.email, user]));
  }

  private async getSupervisorsMap(
    supervisorIds: string[]
  ): Promise<Map<string, any>> {
    const supervisors = await this.userRepository.findByIdsAndRole(
      supervisorIds
    );
    return new Map(
      supervisors.map((supervisor) => [supervisor.id, supervisor])
    );
  }

  private createUserData(user: any, password: string) {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      phoneNumber: user.phoneNumber,
      password: password,
      email: user.email,
      address: user.address,
      role: user.role,
      supervisorId: user.supervisorId,
      region: user.region,
      addedBy: user.addedBy,
    };
  }

  private async sendAccountCreationMail(user: any, password: string) {
    const mail = {
      subject: "User Account Creation",
      name: user.name,
      email: user.email.toLowerCase(),
      password: password,
      link: process.env.FRONTEND_BASEURL + "/login",
    };
    try {
      await this.mailService.sendUserAccountMail(mail);
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Error sending account creation mail"
      );
    }
  }

  async getAllUsers(req: any) {
    const {
      page = 1,
      limit = 10,
      role,
      status,
      region,
      phoneNumber,
    } = req.query;

    const filters: Record<string, any> = {};
    if (role) filters.role = role;
    if (status) filters.status = status;
    if (region) filters.region = region;
    if (phoneNumber) filters.phoneNumber = phoneNumber;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: users, totalRecords } =
        await this.userRepository.findAndCountAll(
          filters,
          [],
          currentPage,
          pageSize
        );

      if (users.length === 0) {
        return {
          users: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const usersWithWalletDetails = await Promise.all(
        users.map(async (user) => {
          const addedBy = await this.userRepository.findById(user.addedBy);
          const reason = await this.reasonRepository.findWhere({
            userId: user.id,
          });
          const supervisor = await this.userRepository.findById(
            user.supervisorId as string
          );
          const means_of_id = await this.idVerificationRepository.findOne({
            userId: user.id,
          });
          const role = await this.roleRepo.findByNameWithRelations(user.role);
          return {
            ...user,
            addedBy: addedBy ? addedBy?.firstName + " " + addedBy?.lastName : "",
            reasons: reason,
            supervisor: {
              firstName: supervisor.firstName,
              lastName: supervisor.lastName,
              middlename: supervisor.middleName,
            },
            wallet: await this.walletService.getWallet(user.id),
            means_of_id: means_of_id ?? {},
            permissions: role?.id
              ? (await this.accessControlManagementService.getRole(role?.id))
                  .permissions
              : [],
          };
        })
      );

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        users: usersWithWalletDetails,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error) {
      logger.error({ error: "Error fetching users," });
      throw new Error("An unexpected error occurred while fetching users.");
    }
  }

  async exportUser(req: any) {
    const { role, status, page = 1, limit = 10 } = req.query;

    const filters: any = {};
    if (role) filters.role = role;
    if (status) filters.status = status;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: users } = await this.userRepository.findAndCountAll(
        filters,
        [],
        currentPage,
        pageSize
      );

      const userIds = users.map((user) => user.id);

      const wallets =
        userIds.length > 0
          ? await this.walletRepository.findAllWhere({ userId: userIds })
          : [];

      const walletMap = new Map(
        wallets.map((wallet) => [wallet.userId, wallet])
      );

      const all_users = users.map((user) => {
        const wallet = walletMap.get(user.id);
        return {
          firstName: user.firstName,
          lastName: user.lastName,
          middleName: user.middleName,
          email: user.email,
          phone_number: user.phoneNumber,
          role: user.role,
          status: user.status,
          account_number: wallet?.accountNumber || "N/A",
        };
      });

      const csvHeader = [
        { id: "name", title: "Name" },
        { id: "email", title: "Email" },
        { id: "phone_number", title: "Phone Number" },
        { id: "role", title: "Role" },
        { id: "account_number", title: "Account Number" },
        { id: "wallet_id", title: "Wallet ID" },
        { id: "status", title: "Status" },
      ];

      const csvContent = await exportCSVData(csvHeader, all_users);

      return {
        csvContent,
        fileName: "exported_users.csv",
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error exporting users: ${error.message}`);
      } else {
        throw new Error("An unexpected error occurred while exporting users.");
      }
    }
  }

  async getProfile(req: any) {
    const user = await this.userRepository.findById(req.user.id);
    const supervisor = await this.userRepository.findById(
      user.supervisorId as string
    );
    const means_of_id = await this.idVerificationRepository.findOneWhere({
      userId: user.id,
    });
    return {
      user: {
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        middleName: user.middleName ?? "",
        phoneNumber: user.phoneNumber ?? "",
        avatar: user.avatar ?? "",
        email: user.email ?? "",
        address: user.address ?? "",
        role: user.role ?? "",
        supervisor: {
          firstName: supervisor.firstName,
          lastName: supervisor.lastName,
          middlename: supervisor.middleName,
        },
        means_of_id: means_of_id ?? {},
        region: user.region ?? "",
      },
      wallet: await this.walletService.getWallet(user.id),
    };
  }

  async userInformation(userId: string): Promise<IUser> {
    return await this.userRepository.findById(userId);
  }

  async deactivateUserAccount(req: any) {
    try {
      const id = req.params.id;
      const user = await this.userRepository.findById(id);

      if (!user) throw new AppError(400, "User not found");
      if (user.status === "inactive")
        throw new AppError(400, "User account is already deactivated");

      await this.userRepository.updateById(id, { status: "inactive" });

      req.body.reason &&
        (await this.createReason({
          userId: user.id,
          action: "deactivate-user",
          reason: req.body.reason,
        }));

      return {
        success: true,
        message: "User account deactivated successfully",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error deactivating user:");
      return {
        success: false,
        message: error.message || "Failed to deactivate user account",
      };
    }
  }

  async reactivateUserAccount(req: any) {
    const id = req.params.id;

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(400, "User not found");
    }

    if (user.status === "active") {
      throw new AppError(400, "User account is already activated");
    }

    const password = generateCode(5);

    const mail = {
      subject: "Account Reactivated",
      name: user.firstName + " " + user.lastName,
      email: user.email.toLowerCase(),
      password: password,
      link: process.env.FRONTEND_BASEURL + "/login",
    };
    try {
      await this.mailService.sendAccountReactivationMail(mail);
    } catch (error: any) {
      logger.error({ error: error.message }, "Error sending mail");
    }

    try {
      const updatedUser = await this.userRepository.updateById(id, {
        status: "active",
        isDefaultPassword: true,
        password: password,
      });

      return {
        success: true,
        message: "User account activated successfully",
        data: updatedUser,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error reactivating user");
      throw new AppError(400, "Failed to activate user account");
    }
  }

  async updateUser(req: Request) {
    try {
      const data = req.body;
      const user = await this.userRepository.findById(req.params.id);
      if (!user) {
        throw new AppError(400, "User does not exist");
      }
      const supervisor = await this.validateSupervisor(data.supervisorId);
      if (!supervisor) {
        throw new AppError(400, "Supervisor does not exist");
      }
      await this.userRepository.updateById(req.params.id, {
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        phoneNumber: data.phoneNumber,
        address: data.address,
        role: data.role,
        supervisorId: data.supervisorId,
      });
      return {
        success: true,
        message: "User data has been updated successfully",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to update user");
      throw new AppError(400, error.message);
    }
  }

  async uploadSignature(req: Request, res: Response) {
    try {
      const user = await this.userRepository.findById(req.user.id);

      if (!user) {
        return res
          .status(httpStatus.CONFLICT)
          .send(ErrorResponse("User does not exists"));
      }
      await this.userRepository.updateById(user.id, {
        signature: req.body.signature,
      });
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Signature uploaded successfully"));
    } catch (error: any) {
      logger.error(`Error uploading signature`);
      throw new ServiceUnavailableError();
    }
  }

  async uploadProfilePicture(req: Request, res: Response) {
    try {
      const user = await this.userRepository.findById(req.user.id);

      if (!user) {
        return res
          .status(httpStatus.CONFLICT)
          .send(ErrorResponse("User does not exists"));
      }
      await this.userRepository.updateById(user.id, {
        avatar: req.body.avatar,
      });
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Profile Picture uploaded successfully"));
    } catch (error: any) {
      logger.error({ error: error.message }, "Error uploading profile picture");
      throw new ServiceUnavailableError(error.message);
    }
  }

  async getUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(400, "User does not exist");
    }

    const [supervisor, means_of_id, addedBy, reason, role] = await Promise.all([
      user.supervisorId
        ? this.userRepository.findById(user.supervisorId as string)
        : null,
      this.idVerificationRepository.findOne({ userId: user.id }),
      user.addedBy ? this.userRepository.findById(user.addedBy) : null,
      this.reasonRepository.findWhere({ userId: user.id }),
      this.roleRepo.findByNameWithRelations(user.role),
    ]);

    const wallet = await this.walletService.getWallet(user.id);
    const permissions = role
      ? (await this.accessControlManagementService.getRole(role.id)).permissions
      : [];

    return {
      ...user,
      addedBy: addedBy ? `${addedBy.firstName} ${addedBy.lastName}` : "",
      reasons: reason || [],
      supervisor: supervisor
        ? {
            firstName: supervisor.firstName,
            lastName: supervisor.lastName,
            middleName: supervisor.middleName || "",
          }
        : { firstName: "", lastName: "", middleName: "" },
      wallet: wallet || {},
      means_of_id: means_of_id || {},
      permissions,
    };
  }

  async deleteUser(req: Request) {
    const id = req.params.id;
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(400, "User does not exist");
    }
    const linkedAgents = await this.userRepository.findOne({
      supervisorId: user.id,
    });
    if (linkedAgents) {
      throw new AppError(
        400,
        "User cannot be deleted because they are assigned as a supervisor to other users."
      );
    }

    const wallet = await this.walletRepository.findOneWhere({
      userId: user.id,
    });

    if (wallet && wallet.balance > 0) {
      throw new AppError(
        400,
        "User cannot be deleted because their wallet has a balance"
      );
    }
    await this.userRepository.deleteById(user.id);
    const data = {
      userId: user.id,
      action: "delete-user",
      reason: req.body.reason,
    };
    if (req.body.reason) await this.createReason(data);
    return "User account deleted successfully";
  }

  async createReason(data: any) {
    try {
      const reason = ActionReasonFactory.createReason(data);
      await this.reasonRepository.save(reason);
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating reason");
    }
  }

  async setTransactionPin(req: Request, res: Response) {
    try {
      const user = await this.userRepository.findById(req.user.id);
      if (!user) {
        return res
          .status(httpStatus.CONFLICT)
          .send(ErrorResponse("User does not exists"));
      }
      await this.userRepository.updateById(user.id, {
        transactionPin: req.body.transactionPin,
      });
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Transaction Pin set successfully"));
    } catch (error: any) {
      logger.error({ error: error.message }, "Error setting transaction pin");

      throw new ServiceUnavailableError();
    }
  }

  async uploadFile(req: Request) {
    try {
      if (!req.file) {
        throw new AppError(400, "No file uploaded");
      }

      const bucketName = appConfig.obs_credential.bucket_name as string;
      const mimeType = req.file.mimetype;
      const fileBuffer = req.file.buffer;
      const objectKey = `uploads/${Date.now()}_${path.basename(
        req.file.originalname
      )}`;

      const uploadedUrl = await uploadMultipart(
        bucketName,
        objectKey,
        fileBuffer,
        mimeType
      );

      return uploadedUrl;
    } catch (error: any) {
      logger.error({ error: "Uoload error" }, error.message);
      throw new ServiceUnavailableError("Upload Error");
    }
  }
}
export default UserService;
