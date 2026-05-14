import { injectable } from "tsyringe";
import UserRepository from "../../userManagement/repositories/user.repository";
import MemberRepository from "../../memberManagement/repositories/member.repository";
import { isAfter } from "date-fns";
import {
  generateCode,
  generateJwtToken,
  generateRefreshToken,
} from "@shared/utils/functions.util";
import OtpRepository from "../../userManagement/repositories/otp.repository";
import OTPService from "./otp.service";
import { bcryptCompareHashedString } from "@shared/utils/hash.util";
import MailService from "../../notificationAndEmailManagement/services/mail.service";
import logger from "@shared/utils/logger";
import AppError from "@shared/error/app.error";
import jwt from "jsonwebtoken";
import ServiceUnavailableError from "@shared/error/service-unavailable.error";
import AccessControlManagementService from "../../accessControlManagement/services/access-control-management.service";
import RoleRepo from "../../accessControlManagement/repositories/role.repo";
import appConfig from "@config/app.config";
@injectable()
class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly memberRepository: MemberRepository,
    private readonly otpRepository: OtpRepository,
    private readonly otpService: OTPService,
    private readonly mailService: MailService,
    private readonly roleRepo: RoleRepo,
    private readonly accessControlManagementService: AccessControlManagementService,
  ) {}

  async verifyOtp(data: { email: string; token: string }) {
    const superAdmin = await this.userRepository.findOne({
      email: data.email,
    });
    if (superAdmin) {
      return this.verifyUserOtp({ data, user: superAdmin });
    }

    const member = await this.memberRepository.findOne({
      email: data.email,
    });
    if (member) {
      return this.verifyUserOtp({ data, user: member });
    }

    return {
      status: false,
      message: "Account not found",
    };
  }

  private async verifyUserOtp({
    data,
    user,
  }: {
    data: { email: string; token: string };
    user: any;
  }) {
    try {
      const checkUnUsedOTP = await this.otpRepository.findOne({
        userId: user.id,
        status: "Pending",
      });
      if (checkUnUsedOTP && data.token === checkUnUsedOTP.token) {
        const id = checkUnUsedOTP.id;
        await this.otpRepository.updateById(id, {
          status: "Success",
        });
      } else {
        return {
          success: false,
          message: "Invalid OTP",
        };
      }

      return {
        success: true,
        message: "Account verified successfully",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "otp verification failed");

      return {
        status: false,
        message:
          error instanceof AppError ? error.message : "Internal server error",
      };
    }
  }

  async resendOtp(data: { email: string }) {
    const superAdmin = await this.userRepository.findOne({
      email: data.email,
    });
    if (superAdmin) {
      return this.resendOtpToUser({ user: superAdmin });
    }

    const member = await this.memberRepository.findOne({
      email: data.email,
    });
    if (member) {
      return this.resendOtpToUser({ user: member });
    }

    return {
      status: false,
      message: "Account not found",
    };
  }

  private async resendOtpToUser({ user }: { user: any }) {
    try {
      const isVerified = await this.otpRepository.findOne({
        userId: user.id,
        status: "Success",
      });
      if (isVerified) {
        return {
          success: false,
          message: "Your account is already verified!",
        };
      }

      const token = generateCode(6);
      await this.otpService.sendOTP({
        userId: user.id,
        token,
        otpType: "account-verification",
      });

      const options = {
        name: user.firstName,
        email: user.email,
        otp: token,
        subject: "Account Verification",
      };
      this.mailService.sendOTPMail(options);

      return {
        success: true,
        message: `Kindly check your email address ${user.email} for OTP`,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "resend otp failed");

      return {
        status: false,
        message:
          error instanceof AppError ? error.message : "Internal server error",
      };
    }
  }

  async requestPasswordReset(data: { email: string }) {
    const superAdmin = await this.userRepository.findOne({
      email: data.email,
    });
    if (superAdmin) {
      return this.requestUserPasswordReset({ user: superAdmin });
    }

    const member = await this.memberRepository.findOne({
      email: data.email,
    });
    if (member) {
      return this.requestUserPasswordReset({ user: member });
    }

    return {
      status: false,
      message: "Account not found",
    };
  }

  private async requestUserPasswordReset({ user }: { user: any }) {
    try {
      const token = generateCode(6);
      await this.otpService.sendOTP({
        userId: user.id,
        token,
        otpType: "password-reset",
      });

      const link = `${process.env.FRONTEND_BASEURL}/reset-password?token=${token}`;

      try {
        await this.mailService.passwordResetMail({
          name: user.firstName,
          email: user.email,
          subject: "Password Reset",
          link,
        });
      } catch (emailError: any) {
        logger.error(
          { error: emailError.message },
          "Failed to send password reset email",
        );
      }

      return {
        success: true,
        message: `Kindly check your email address ${user.email} for password reset link`,
      };
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "request user password reset failed",
      );

      return {
        status: false,
        message:
          error instanceof AppError ? error.message : "Internal server error",
      };
    }
  }

  async resetPassword(req: any) {
    const { token } = req.query;
    const { email, password } = req.body;

    const superAdmin = await this.userRepository.findOne({
      email: email,
    });
    if (superAdmin) {
      return this.resetUserPassword({
        data: { token, password },
        user: superAdmin,
        repository: this.userRepository,
      });
    }

    const member = await this.memberRepository.findOne({
      email: email,
    });
    if (member) {
      return this.resetUserPassword({
        data: { token, password },
        user: member,
        repository: this.memberRepository,
      });
    }

    return {
      status: false,
      message: "Account not found",
    };
  }

  private async resetUserPassword({
    data,
    user,
    repository,
  }: {
    data: { token: string; password: string };
    user: any;
    repository: UserRepository | MemberRepository;
  }) {
    try {
      const checkOtp = await this.otpRepository.findOne({
        userId: user.id,
        token: data.token,
        status: "Pending",
      });

      if (!checkOtp) {
        return {
          success: false,
          message: "Invalid link",
        };
      }

      const currentTime = new Date();
      const expirationTime = new Date(checkOtp.expiringDatetime);
      if (isAfter(currentTime, expirationTime)) {
        throw new AppError(400, "link has expired");
      }

      const id = checkOtp.id;
      await repository.updateById(checkOtp.userId, {
        password: data.password,
      });
      await this.otpRepository.updateById(id, { status: "Success" });

      return {
        success: true,
        message: "Password has been reset successfully",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "reset user password failed");

      return {
        status: false,
        message:
          error instanceof AppError ? error.message : "Internal server error",
      };
    }
  }

  async changePasswordOnFirstLogin(data: { userId: string; password: string }) {
    try {
      const user = await this.userRepository.findOne({ id: data.userId });
      if (!user) {
        throw new AppError(400, "User not found");
      }

      if (user.isDefaultPassword == false) {
        throw new AppError(
          400,
          "Can`t perform this action!. Your password has been changed already.",
        );
      }
      const id = user.id;

      await this.userRepository.updateById(id, {
        password: data.password,
        status: "active",
        isDefaultPassword: false,
      });

      const message: string =
        "Your Password has been changed successfully. Kindly proceed to Login";
      const token = {
        token: await generateJwtToken(user),
      };
      return { success: true, message: message, data: token };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error changing password");
    }
  }

  async login(data: { email: string; password: string }) {
    const superAdmin = await this.userRepository.findOne({
      email: data.email,
    });
    if (superAdmin) {
      return this.loginUser({
        data,
        user: superAdmin,
        repository: this.userRepository,
        requiresOtpCheck: true,
      });
    }

    const member = await this.memberRepository.findOne({
      email: data.email,
    });
    if (member) {
      return this.loginUser({
        data,
        user: member,
        repository: this.memberRepository,
      });
    }

    return {
      status: false,
      message: "This email is not registered to any account",
    };
  }

  private async loginUser({
    data,
    user,
    repository,
    requiresOtpCheck = false,
  }: {
    data: { email: string; password: string };
    user: any;
    repository: UserRepository | MemberRepository;
    requiresOtpCheck?: boolean;
  }) {
    try {
      if (user.isDefaultPassword) {
        return {
          status: false,
          message: "Please change your password from the default password.",
          data: { userId: user.id },
        };
      }

      if (user.status === "deactivated") {
        throw new AppError(
          400,
          "Your account has been deactivated. Please contact administrator.",
        );
      }

      if (requiresOtpCheck) {
        const notVerified = await this.otpRepository.findOne({
          userId: user.id,
          status: "pending",
        });

        if (notVerified) {
          throw new AppError(400, "Your account is not verified!");
        }
      }

      const passwordMatch = await bcryptCompareHashedString(
        data.password,
        String(user.password),
      );

      if (!passwordMatch) {
        throw new AppError(400, "Password is incorrect. Kindly check!");
      }

      const accessToken = await generateJwtToken(user);
      const refreshToken = await generateRefreshToken(user);
      await repository.updateById(user.id, { refreshToken });

      try {
        await this.mailService.sendLoginEmail({
          email: user.email,
          subject: "Login Notification",
          name: user.firstName,
        });
      } catch (err: any) {
        logger.error(
          { error: err.message },
          "Failed to send login notification email",
        );
      }

      const role = await this.roleRepo.findById(String(user.roleId));

      const { password, ...loggedInUser } = user;

      return {
        status: true,
        message: "Login successful",
        data: {
          user: loggedInUser,
          role: role.slug,
          accessToken,
          permissions: role?.id
            ? (await this.accessControlManagementService.getRole(role.id))
                .permissions
            : [],
        },
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Login failed");

      return {
        status: false,
        message:
          error instanceof AppError ? error.message : "Internal server error",
      };
    }
  }

  async refreshToken(oldRefreshToken: { refreshToken: string }) {
    const decoded = jwt.verify(
      oldRefreshToken.refreshToken,
      appConfig.jwt_token.secret,
    );

    const superAdmin = await this.userRepository.findOne({
      id: decoded.user.id,
    });

    if (superAdmin) {
      return this.refreshUserToken({
        oldRefreshToken: oldRefreshToken.refreshToken,
        user: superAdmin,
      });
    }

    const member = await this.memberRepository.findOne({
      id: decoded.user.id,
    });
    if (member) {
      return this.refreshUserToken({
        oldRefreshToken: oldRefreshToken.refreshToken,
        user: member,
      });
    }

    return {
      status: false,
      message: "Account not found",
    };
  }

  private async refreshUserToken({
    oldRefreshToken,
    user,
  }: {
    oldRefreshToken: string;
    user: any;
  }) {
    try {
      if (!user || user.refreshToken !== oldRefreshToken) {
        throw new AppError(401, "Invalid refresh token");
      }

      const newAccessToken = await generateJwtToken(user);
      return {
        message: "Token refreshed successfully",
        data: { accessToken: newAccessToken },
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error refreshing token");
      throw new ServiceUnavailableError(
        "Invalid or expired refresh token" + error.message,
      );
    }
  }
}

export default AuthService;
