import { injectable } from "tsyringe";
import { AddMember } from "../dtos/add-member.dto";
import MemberFactory from "../factories/member.factory";
import MemberRepository from "../repositories/member.repository";
import ChurchRepository from "../../churchManagement/repositories/church.repository";
import UserRepository from "../../userManagement/repositories/user.repository";
import MailService from "../../userManagement/services/mail.service";
import { generateCode } from "@shared/utils/functions.util";
import logger from "@shared/utils/logger";
// import { IMember } from "../model/member.model";
import AppError from "@shared/error/app.error";
import AccessControlManagementService from "../../accessControlManagement/services/access-control-management.service";

@injectable()
class MemberService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly churchRepository: ChurchRepository,
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
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
}

export default MemberService;
