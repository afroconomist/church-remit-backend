import { injectable } from "tsyringe";
import { Request } from "express";
import { AddMember } from "../dtos/add-member.dto";
import { CreateCategory } from "../dtos/create-category.dto";
import {
  generateCode,
  generateJwtToken,
  generateRefreshToken,
} from "@shared/utils/functions.util";
import MemberFactory from "../factories/member.factory";
import MemberRepository from "../repositories/member.repository";
import ChurchRepository from "../../churchManagement/repositories/church.repository";
import UserRepository from "../../userManagement/repositories/user.repository";
import MemberBirthdayFactory from "../factories/member_birthday.factory";
import MemberBirthdayRepository from "../repositories/member_birthday.repository";
import ReasonRepository from "../../userManagement/repositories/reason.repository";
import ActionReasonFactory from "../../userManagement/factories/action_reason.factory";
import CategoryFactory from "../factories/category.factory";
import CategoryRepository from "../repositories/category.repository";
import FamilyMemberRepository from "../../familyManagement/repositories/family_member.repository";
import MailService from "../../notificationAndEmailManagement/services/mail.service";
import AccessControlManagementService from "../../accessControlManagement/services/access-control-management.service";
import RoleRepo from "../../accessControlManagement/repositories/role.repo";
import { bcryptCompareHashedString } from "@shared/utils/hash.util";
import logger from "@shared/utils/logger";
import { IMember } from "../model/member.model";
import AppError from "@shared/error/app.error";
import slugify from "slugify";
import { getAgeByDate } from "@shared/utils/functions.util";
import { uploadFileToS3 } from "@shared/utils/file-upload.util";

@injectable()
class MemberService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly churchRepository: ChurchRepository,
    private readonly userRepository: UserRepository,
    private readonly memberBirthdayRepository: MemberBirthdayRepository,
    private readonly mailService: MailService,
    private readonly roleRepo: RoleRepo,
    private readonly accessControlManagementService: AccessControlManagementService,
    private readonly reasonRepository: ReasonRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly familyMemberRepository: FamilyMemberRepository,
  ) {}

  async addMember(member_data: AddMember, superAdminId: string) {
    try {
      const accountExists = await this.userRepository.findOne({
        email: member_data.email,
      });
      if (accountExists)
        return {
          success: false,
          message: "Account already exists with this email",
        };

      const superAdminExists = await this.userRepository.findById(superAdminId);
      if (!superAdminExists)
        return { success: false, message: "Super admin does not exist" };

      const churchExists = await this.churchRepository.findById(
        String(superAdminExists.churchId),
      );
      if (!churchExists)
        return { success: false, message: "Church does not exist" };

      const role = await this.roleRepo.findByName("member");
      if (!role) return { success: false, message: "Role not found" };

      const memberExists = await this.memberRepository.findOne({
        email: member_data.email,
      });
      if (memberExists)
        return { success: false, message: "Member already added" };

      const memberCategory = await this.categoryRepository.findOne({
        slug: "youth-ministry",
      });
      if (!memberCategory)
        return { success: false, message: "Member category not found" };

      const memberPassword = this.generateMemberPassword();

      const ageOfMember = getAgeByDate(String(member_data.dateOfBirth));
      if (ageOfMember > 18 && ageOfMember < 35) {
        const member = MemberFactory.addMember({
          ...member_data,
          password: memberPassword,
          roleId: role.id,
          addedBy: superAdminId,
          churchId: String(superAdminExists.churchId),
          memberCategoryId: memberCategory.id,
        });
        const addedMember = await this.memberRepository.save(member);

        if (addedMember.dateOfBirth) {
          const memberBirthday = MemberBirthdayFactory.addMemberBirthday({
            celebrantName: `${addedMember.firstName} ${addedMember.lastName}`,
            dateOfBirth: addedMember.dateOfBirth,
            celebrantEmail: addedMember.email,
            celebrantPhone: addedMember.phoneNumber,
            campus: "Member campus",
            memberId: addedMember.id,
            churchId: addedMember.churchId,
          });
          await this.memberBirthdayRepository.save(memberBirthday);
        }

        const emailResponse = await this.sendAccountCreationEmail(
          addedMember,
          memberPassword,
        );
        if (!emailResponse.success) return emailResponse;

        await this.categoryRepository.updateById(memberCategory.id, {
          members: Number(memberCategory.members) + 1,
        });

        return {
          success: true,
          message: "Member has been added successfully",
          welcome_mail: `Kindly check your email address ${member.email} for welcome mail`,
          added_member_data: addedMember,
        };
      }

      const member = MemberFactory.addMember({
        ...member_data,
        password: memberPassword,
        roleId: role.id,
        addedBy: superAdminId,
        churchId: String(superAdminExists.churchId),
      });
      const addedMember = await this.memberRepository.save(member);

      if (addedMember.dateOfBirth) {
        const memberBirthday = MemberBirthdayFactory.addMemberBirthday({
          celebrantName: `${addedMember.firstName} ${addedMember.lastName}`,
          dateOfBirth: addedMember.dateOfBirth,
          celebrantEmail: addedMember.email,
          celebrantPhone: addedMember.phoneNumber,
          campus: "Member campus",
          memberId: addedMember.id,
          churchId: addedMember.churchId,
        });
        await this.memberBirthdayRepository.save(memberBirthday);
      }

      const emailResponse = await this.sendAccountCreationEmail(
        addedMember,
        memberPassword,
      );
      if (!emailResponse.success) return emailResponse;

      return {
        success: true,
        message: "Member has been added successfully",
        welcome_mail: `Kindly check your email address ${member.email} for welcome mail`,
        added_member_data: addedMember,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error adding member");
      throw new AppError(
        400,
        error.message || "An unexpected error occurred while adding member",
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
      link: `${process.env.FRONTEND_BASEURL}/member/login`,
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

  async assignRoleToMember(req: Request) {
    try {
      const member = await this.memberRepository.findById(req.params.id);
      if (!member) {
        throw new AppError(400, "Member does not exist");
      }

      const role = await this.roleRepo.findById(req.body.roleId);
      if (!role) {
        throw new AppError(400, "Role does not exist");
      }

      await this.memberRepository.updateById(req.params.id, {
        roleId: role.id,
      });

      return {
        success: true,
        message: `${role.name} Role has been successfully assigned to member`,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to assign role to member");
      throw new AppError(400, error.message);
    }
  }

  async loginMember(data: { email: string; password: string }) {
    try {
      const member = await this.memberRepository.findOne({ email: data.email });
      if (!member) {
        throw new AppError(400, "Member not found");
      }

      if (member.isDefaultPassword === true) {
        return {
          status: false,
          message: "Please change your password from the default password.",
          data: { memberId: member.id },
        };
      }

      if (member.status === "deactivated") {
        throw new AppError(
          400,
          "Your account has been deactivated. Please contact administrator.",
        );
      }

      const passwordMatch = await bcryptCompareHashedString(
        data.password,
        String(member.password),
      );
      if (!passwordMatch) {
        throw new AppError(400, "Password is incorrect. Kindly check!");
      }

      const accessToken = await generateJwtToken(member);
      const refreshToken = await generateRefreshToken(member);
      await this.memberRepository.updateById(member.id, { refreshToken });

      try {
        await this.mailService.sendLoginEmail({
          email: member.email,
          subject: "Login Notification",
          name: member.firstName,
        });
      } catch (emailError: any) {
        logger.error(
          { error: emailError.message },
          "Failed to send login notification email",
        );
      }

      const role = await this.roleRepo.findById(String(member.roleId));
      const returnResponse = {
        member,
        accessToken,
        permissions: role?.id
          ? (await this.accessControlManagementService.getRole(role?.id))
              .permissions
          : [],
      };

      return {
        status: true,
        message: "Login successful",
        data: returnResponse,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error logging in");
      return {
        status: false,
        message:
          error instanceof AppError ? error.message : "Internal server error",
      };
    }
  }

  async changePasswordOnFirstLogin(data: {
    memberId: string;
    password: string;
  }) {
    try {
      const member = await this.memberRepository.findOne({ id: data.memberId });
      if (!member) {
        throw new AppError(400, "Member not found");
      }

      if (member.isDefaultPassword == false) {
        throw new AppError(
          400,
          "Can`t perform this action!. Your password has been changed already.",
        );
      }
      const id = member.id;

      await this.memberRepository.updateById(id, {
        password: data.password,
        status: "active",
        isDefaultPassword: false,
      });

      const message: string =
        "Your Password has been changed successfully. Kindly proceed to Login";
      const token = {
        token: await generateJwtToken(member),
      };
      return { success: true, message: message, data: token };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error changing password");
    }
  }

  async getMemberProfile(req: any) {
    const member = await this.memberRepository.findById(req.user.id);
    if (!member) return { success: false, message: "Member does not exist" };

    return {
      success: true,
      message: "Member profile retrieved successfully",
      member: {
        firstName: member.firstName ?? "",
        lastName: member.lastName ?? "",
        middleName: member.middleName ?? "",
        phoneNumber: member.phoneNumber ?? "",
        avatar: member.avatar ?? "",
        email: member.email ?? "",
        address: member.streetAddress ?? "",
        role: member.roleId ?? "",
      },
    };
  }

  async updateMember(req: Request) {
    try {
      const data = req.body;
      const member = await this.memberRepository.findById(req.params.id);
      if (!member) {
        throw new AppError(400, "Member does not exist");
      }

      const memberBirthdayExist = await this.memberBirthdayRepository.findOne({
        memberId: member.id,
        churchId: member.churchId,
      });

      // const superAdminExists = await this.userRepository.findById(
      //   member.addedBy
      // );
      // if (!superAdminExists)
      //   return { success: false, message: "Super admin does not exist" };

      await this.memberRepository.updateById(req.params.id, {
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth,
        maritalStatus: data.maritalStatus,
        occupation: data.occupation,
        streetAddress: data.streetAddress,
        city: data.city,
        state: data.state,
        country: data.country,
        contactName: data.contactName,
        contactNumber: data.contactNumber,
        relationship: data.relationship,
        membershipStatus: data.membershipStatus,
        joinDate: data.joinDate,
        baptismDate: data.baptismDate,
      });

      if (data.dateOfBirth && !memberBirthdayExist) {
        const memberBirthday = MemberBirthdayFactory.addMemberBirthday({
          celebrantName: `${member.firstName} ${member.lastName}`,
          dateOfBirth: data.dateOfBirth,
          celebrantEmail: member.email,
          celebrantPhone: member.phoneNumber,
          campus: "Member campus",
          memberId: member.id,
          churchId: member.churchId,
        });
        await this.memberBirthdayRepository.save(memberBirthday);
      } else if (data.dateOfBirth && memberBirthdayExist) {
        await this.memberBirthdayRepository.updateById(memberBirthdayExist.id, {
          dateOfBirth: data.dateOfBirth,
        });
      }

      return {
        success: true,
        message: "Member data has been updated successfully",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to update member");
      throw new AppError(400, error.message);
    }
  }

  async uploadMemberProfilePicture(req: Request) {
    const image = req.file;

    if (!image) {
      throw new AppError(400, "No profile picture uploaded");
    }

    try {
      const member = await this.memberRepository.findById(req.params.id);
      if (!member) {
        throw new AppError(400, "Member does not exist");
      }

      const fileData = await uploadFileToS3(
        image,
        `images/${image.originalname}`,
      );
      if (!fileData) {
        throw new AppError(400, "Profile picture upload failed");
      }

      await this.memberRepository.updateById(member.id, {
        avatar: fileData.url,
      });

      return {
        success: true,
        message: "Member profile picture has been updated successfully",
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Failed to update member profile picture",
      );
      throw new AppError(400, error.message);
    }
  }

  async getMember(id: string) {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new AppError(400, "Member does not exist");
    }

    const [addedBy, reason, role] = await Promise.all([
      member.addedBy ? this.memberRepository.findById(member.addedBy) : null,
      this.reasonRepository.findWhere({ userId: member.id }),
      this.roleRepo.findByNameWithRelations(String(member.roleId)),
    ]);

    const permissions = role
      ? (await this.accessControlManagementService.getRole(role.id)).permissions
      : [];

    return {
      ...member,
      addedBy: addedBy ? `${addedBy.firstName} ${addedBy.lastName}` : "",
      reasons: reason || [],
      permissions,
    };
  }

  async deleteMember(req: Request) {
    const id = req.params.id;
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new AppError(400, "Member does not exist");
    }
    const memberBirthday = await this.memberBirthdayRepository.findOne({
      memberId: member.id,
    });

    await this.memberRepository.deleteById(member.id);
    if (memberBirthday) {
      await this.memberBirthdayRepository.deleteById(memberBirthday.id);
    }

    return "Member account deleted successfully";
  }

  async createReason(data: any) {
    try {
      const reason = ActionReasonFactory.createReason(data);
      await this.reasonRepository.save(reason);
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating reason");
    }
  }

  async uploadBulkMembers(req: any) {
    const members = req.body;
    const notAdded: any[] = [];
    const added: any[] = [];
    let addedBy = req.user.id;

    try {
      const existingMembersMap = await this.getExistingMembers(members);
      const supervisorsMap = await this.getSupervisors(members);
      const { membersDataArray, mailDataArray } = this.processMembers(
        members,
        existingMembersMap,
        supervisorsMap,
        added,
        notAdded,
        addedBy,
      );

      await this.saveMembers(membersDataArray);
      await this.sendNotificationEmails(mailDataArray);

      return {
        success: true,
        message: "Members upload successful",
        data: { added, notAdded },
      };
    } catch (error: any) {
      logger.error(
        { error: JSON.stringify(error) },
        "MemberService [BulkMemberOnboarding]: Error Creating Members",
      );
    }
  }

  private async getExistingMembers(members: any[]): Promise<Map<string, any>> {
    const emails = members.map((member) => member.email);
    return await this.getExistingMembersMap(emails);
  }

  private async getSupervisors(members: any[]): Promise<Map<string, any>> {
    const supervisorIds = Array.from(
      new Set(members.map((member) => member.supervisorId)),
    );
    return await this.getSupervisorsMap(supervisorIds);
  }

  private processMembers(
    members: any[],
    existingMembersMap: Map<string, any>,
    supervisorsMap: Map<string, any>,
    added: any[],
    notAdded: any[],
    addedBy: string,
  ) {
    const membersDataArray: IMember[] = [];
    const mailDataArray: {
      subject: string;
      name: string;
      email: string;
      password: string;
      link: string;
    }[] = [];

    members.forEach((member) => {
      if (this.isExistingMember(member, existingMembersMap, notAdded)) return;
      if (!this.hasValidSupervisor(member, supervisorsMap, notAdded)) return;

      const password = generateCode(5);
      member.addedBy = addedBy;
      this.addMemberAndMailData(
        member,
        password,
        membersDataArray,
        mailDataArray,
        added,
        notAdded,
      );
    });

    return { membersDataArray, mailDataArray };
  }

  private async saveMembers(membersDataArray: IMember[]): Promise<IMember[]> {
    if (membersDataArray.length) {
      return await this.memberRepository.saveMany(membersDataArray);
    }
    return [];
  }

  private async sendNotificationEmails(mailDataArray: any[]): Promise<void> {
    if (mailDataArray.length)
      await this.mailService.sendBulkUserAccountMail(mailDataArray);
  }

  private async getExistingMembersMap(
    emails: string[],
  ): Promise<Map<string, any>> {
    const existingMembers = await this.memberRepository.findByEmails(emails);
    return new Map(existingMembers.map((member) => [member.email, member]));
  }

  private async getSupervisorsMap(
    supervisorIds: string[],
  ): Promise<Map<string, any>> {
    const supervisors = await this.memberRepository.findByIdsAndRole(
      supervisorIds,
    );
    return new Map(
      supervisors.map((supervisor) => [supervisor.id, supervisor]),
    );
  }

  private addMemberAndMailData(
    member: any,
    password: string,
    memmbersDataArray: IMember[],
    mailDataArray: any[],
    added: any[],
    notAdded: any[],
  ) {
    try {
      const newMember = MemberFactory.addMember(
        this.createMemberData(member, password),
      );
      memmbersDataArray.push(newMember);
      mailDataArray.push({
        subject: "Member Account Creation",
        name: member.name,
        email: member.email,
        password: password,
        link: `${process.env.FRONTEND_BASEURL}/login`,
      });

      added.push({
        email: member.email,
        status: "Member created successfully",
      });
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating member");
      notAdded.push({ email: member.email, reason: `Error: ${error.message}` });
    }
  }

  private isExistingMember(
    member: any,
    existingMembersMap: Map<string, any>,
    notAdded: any[],
  ): boolean {
    if (existingMembersMap.has(member.email)) {
      notAdded.push({
        email: member.email,
        reason: "Account with this email already exists",
      });
      return true;
    }
    return false;
  }

  private hasValidSupervisor(
    member: any,
    supervisorsMap: Map<string, any>,
    notAdded: any[],
  ): boolean {
    const supervisor = supervisorsMap.get(member.supervisorId);
    if (!supervisor) {
      notAdded.push({
        email: member.email,
        reason: "Supervisor does not exist",
      });
      return false;
    }
    return true;
  }

  private createMemberData(member: any, password: string) {
    return {
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      password: password,
      phoneNumber: member.phoneNumber,
      roleId: member.roleId,
      addedBy: member.addedBy,
      churchId: member.churchId,
    };
  }

  async createMemberCategory(data: CreateCategory, superAdminId: string) {
    try {
      const superAdmin = await this.userRepository.findById(superAdminId);
      if (!superAdmin) throw new AppError(400, "Super admin does not exist");

      const categoryExist = await this.categoryRepository.findOne({
        categoryName: data.categoryName,
        churchId: superAdmin.churchId,
      });
      if (categoryExist)
        return {
          status: false,
          message: `${data.categoryName} already exist, use another name!`,
        };

      const category = CategoryFactory.createCategory({
        categoryName: data.categoryName,
        description: data.description,
        categoryType: data.categoryType,
        churchId: String(superAdmin.churchId),
      });
      const memberCategory = await this.categoryRepository.save(category);

      return {
        success: true,
        message: "Member category has been added successfully",
        category: memberCategory,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error adding member");
      throw new AppError(
        400,
        error.message || "An unexpected error occurred while adding member",
      );
    }
  }

  async getChurchMemberCategories(req: any) {
    const churchId = req.params.churchId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: memberCategories, totalRecords } =
        await this.categoryRepository.findAndCountAll(
          { churchId },
          page,
          limit,
        );

      if (memberCategories.length === 0) {
        return {
          memberCategories: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        memberCategories,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching all church member categories" });
      throw new Error(
        "An unexpected error occurred while fetching all church member categories.",
      );
    }
  }

  async editMemberCategory(req: any) {
    try {
      const data = req.body;
      const category = await this.categoryRepository.findById(
        req.params.categoryId,
      );
      if (!category) throw new AppError(400, "Category not found");

      const slug = slugify(data.categoryName, { lower: true });

      await this.categoryRepository.updateById(category.id, {
        categoryName: data.categoryName,
        description: data.description,
        categoryType: data.categoryType,
        slug,
      });

      return {
        success: true,
        message: "Category has been updated successfully",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to update category");
      throw new AppError(400, error.message);
    }
  }

  async deleteMemberCategory(categoryId: string) {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) throw new AppError(400, "Category not found");

    await this.categoryRepository.deleteById(category.id);

    return `${category.categoryName} member category has been deleted successfully`;
  }

  async getChurchUpcomingMembersBirthdays(req: any) {
    const churchId = req.params.churchId;
    const { range, page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;
    const rangeNumber = parseInt(range, 10) || 0;

    try {
      const { data: membersBirthdays, totalRecords } =
        await this.memberBirthdayRepository.findUpcomingBirthdays(
          { churchId },
          rangeNumber,
          currentPage,
          pageSize,
        );

      if (membersBirthdays.length === 0) {
        return {
          membersBirthdays: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        membersBirthdays,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({
        error: "Error fetching all church upcoming members birthdays",
      });
      throw new Error(
        "An unexpected error occurred while fetching all church upcoming members birthdays.",
      );
    }
  }

  async getMemberFamily(req: Request) {
    try {
      const member = await this.familyMemberRepository.findOne({
        churchMemberId: req.params.id,
      });
      if (!member) throw new AppError(400, "Member doesn't have a family");

      const familyMembers = await this.familyMemberRepository.findAll({
        family: member.family,
      });

      return { familyMembers };
    } catch (error) {
      logger.error({ error: "Error fetching member family members" });
      throw new Error(
        "An unexpected error occurred while fetching member family members.",
      );
    }
  }

  async getMemberCelebrations(req: Request) {
    try {
      const memberBirthday = await this.memberBirthdayRepository.findOne({
        memberId: req.params.id,
      });
      if (!memberBirthday)
        throw new AppError(400, "Member has not provided date of birth");

      return { memberBirthday };
    } catch (error) {
      logger.error({ error: "Error fetching member family members" });
      throw new Error(
        "An unexpected error occurred while fetching member family members.",
      );
    }
  }

  async sendBirthdayMessage(req: Request) {
    try {
      const memberBirthday = await this.memberBirthdayRepository.findOne({
        memberId: req.params.id,
      });
      if (!memberBirthday)
        throw new AppError(400, "Member has not provided date of birth");

      await this.mailService.sendBirthdayMessage({
        name: memberBirthday.celebrantName,
        email: memberBirthday.celebrantEmail,
        subject: "Happy Birthday!",
        link: `https://example.com/birthday/${memberBirthday.id}`,
      });

      return { message: "Birthday message sent successfully" };
    } catch (error) {
      logger.error({ error: "Error sending birthday message" });
      throw new Error(
        "An unexpected error occurred while sending birthday message.",
      );
    }
  }
}

export default MemberService;
