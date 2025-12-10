import { injectable } from "tsyringe";
import { AddMember } from "../dtos/add-member.dto";
import MemberFactory from "../factories/member.factory";
import MemberRepository from "../repositories/member.repository";
import ChurchRepository from "../../churchManagement/repositories/church.repository";
import UserRepository from "../../userManagement/repositories/user.repository";
// import MailService from "../../userManagement/services/mail.service";
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
    // private readonly mailService: MailService,
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

      const memberPassword = this.generateMemberPassword();

      const member = MemberFactory.addMember({
        ...member_data,
        password: memberPassword,
        addedBy: superAdminId,
        churchId: String(superAdminExists.churchId),
      });
      const addedMember = await this.memberRepository.save(member);

      return {
        success: true,
        message: "Church and user account has been created successfully",
        welcome_mail: `Kindly check your email address ${member.email} for welcome email`,
        added_member_data: addedMember,
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

  private generateMemberPassword(): string {
    return generateCode(5);
  }
}

export default MemberService;
