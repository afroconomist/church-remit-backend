import { injectable } from "tsyringe";
import { Request } from "express";
import { AddMember } from "../dtos/add-member.dto";
import {
  generateCode,
  generateJwtToken,
  generateRefreshToken,
} from "@shared/utils/functions.util";
import MemberFactory from "../factories/member.factory";
import MemberRepository from "../repositories/member.repository";
import ChurchRepository from "../../churchManagement/repositories/church.repository";
import UserRepository from "../../userManagement/repositories/user.repository";
import ReasonRepository from "../../userManagement/repositories/reason.repository";
import ActionReasonFactory from "../../userManagement/factories/action_reason.factory";
import MailService from "../../userManagement/services/mail.service";
import AccessControlManagementService from "../../accessControlManagement/services/access-control-management.service";
import RoleRepo from "../../accessControlManagement/repositories/role.repo";
import { bcryptCompareHashedString } from "@shared/utils/hash.util";
import logger from "@shared/utils/logger";
// import { IMember } from "../model/member.model";
import AppError from "@shared/error/app.error";

@injectable()
class MemberService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly churchRepository: ChurchRepository,
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
    private readonly roleRepo: RoleRepo,
    private readonly accessControlManagementService: AccessControlManagementService,
    private readonly reasonRepository: ReasonRepository
  ) {}

  async addMember(member_data: AddMember, superAdminId: string) {
    try {
      const superAdminExists = await this.userRepository.findById(superAdminId);
      if (!superAdminExists)
        return { success: false, message: "Super admin does not exist" };

      const churchExists = await this.churchRepository.findById(
        String(superAdminExists.churchId)
      );
      if (!churchExists)
        return { success: false, message: "Church does not exist" };

      const roleExists =
        await this.accessControlManagementService.checkRoleExists(
          member_data.roleId
        );
      if (!roleExists)
        return { success: false, message: "Role does not exist" };

      const email: string = member_data.email;
      const memberExists = await this.memberRepository.findOne({ email });
      if (memberExists)
        return { success: true, message: "Member already added" };

      const memberPassword = this.generateMemberPassword();

      const member = MemberFactory.addMember({
        ...member_data,
        password: memberPassword,
        addedBy: superAdminId,
        churchId: String(superAdminExists.churchId),
      });
      const addedMember = await this.memberRepository.save(member);

      const emailResponse = await this.sendAccountCreationEmail(
        addedMember,
        memberPassword
      );
      if (!emailResponse.success) return emailResponse;

      return {
        success: true,
        message: "Church and user account has been created successfully",
        welcome_mail: `Kindly check your email address ${member.email} for welcome mail`,
        added_member_data: addedMember,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error adding member");
      throw new AppError(
        400,
        error.message || "An unexpected error occurred while adding member"
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
      link: process.env.FRONTEND_BASEURL + "/auth/login",
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
          "Your account has been deactivated. Please contact administrator."
        );
      }

      const passwordMatch = await bcryptCompareHashedString(
        data.password,
        String(member.password)
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
          "Failed to send login notification email"
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
          "Can`t perform this action!. Your password has been changed already."
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
    try {
      const member = await this.memberRepository.findById(req.params.id);
      if (!member) {
        throw new AppError(400, "Member does not exist");
      }

      await this.memberRepository.updateById(req.params.id, {
        avatar: req.body.avatar,
      });

      return {
        success: true,
        message: "Member profile picture has been updated successfully",
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Failed to update member profile picture"
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
    const linkedAgents = await this.memberRepository.findOne({
      supervisorId: member.id,
    });
    if (linkedAgents) {
      throw new AppError(
        400,
        "Member cannot be deleted because they are assigned as a supervisor to other members."
      );
    }

    await this.memberRepository.deleteById(member.id);
    const data = {
      memberId: member.id,
      action: "delete-member",
      reason: req.body.reason,
    };
    if (req.body.reason) await this.createReason(data);
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
}

export default MemberService;
