import { injectable } from "tsyringe";
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
    private readonly accessControlManagementService: AccessControlManagementService
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
}

export default MemberService;
