import { injectable } from "tsyringe";
import UserRepository from "../repositories/user.repository";
import { isAfter } from "date-fns";
import { generateCode, generateJwtToken, generateRefreshToken } from "@shared/utils/functions.util";
import OtpRepository from "../repositories/otp.repository";
import OTPService from "./otp.service";
import { bcryptCompareHashedString } from "@shared/utils/hash.util";
import MailService from "./mail.service";
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
    private readonly OtpRepository: OtpRepository,
    private readonly otpService: OTPService,
    private readonly mailService: MailService,
    private readonly roleRepo: RoleRepo,
    private readonly accessControlManagementService: AccessControlManagementService,

  ) {}

  async forgetPassword(data: { email: string }) {
    try {
      const user = await this.userRepository.findOne({ email: data.email });
      if (!user) {
        throw new AppError(400, "User not found");
      }
      // generate a password reset link
      const token = generateCode(6);
      await this.otpService.sendOTP({user, token, otpType: "password-reset"})
      return {
        success: true,
        message: `Kindly check your email address ${user.email} for OTP`,
      };
    } catch (error: any) {
      logger.error({error: error.message}, "Error resetting password");
    }
  }

  async resetPassword(data: { email: string; password: string, token: string }) {
    try {
      const user = await this.userRepository.findOne({ email: data.email });
      if (!user) {
        throw new AppError(400, "User not found");
      }

      const checkOtp = await this.OtpRepository.findOne({
        userId: user.id,
        token: data.token,
        status: 'pending',
      });
      
      if (!checkOtp) {
        return {
          success: false,
          message: "Invalid OTP",
        };
      }
      
      const currentTime = new Date();
      const expirationTime = new Date(checkOtp.expiringDatetime);
      if (isAfter(currentTime, expirationTime)) {
        throw new AppError(400, "OTP has expired");
      }
  
      const id = checkOtp.id;
      
      try {
        await this.userRepository.updateById(checkOtp.userId, { isDefaultPassword: false, password: data.password });
        await this.OtpRepository.updateById(id, { status: 'used' });
      } catch (error: any) {
        logger.error({error: error.message}, "Error comfirming otp");
      }
    
      return {
        success: true,
        message: "Password has been reset successfully",
      };

    } catch (error: any) {
      logger.error({error: error.message}, "Error resetting otp");
    }
  }

  async changePasswordOnFirstLogin(data: { userId: string; password: string }) {
    try {
      const user = await this.userRepository.findOne({ id: data.userId });
      if (!user) {
        throw new AppError(400, "User not found");
      }

      if(user.isDefaultPassword == false){
        throw new AppError(400, "Can`t perform this action!. Your password has been changed already.");
      }
      const id = user.id;
      
      await this.userRepository.updateById(id, { password: data.password, status: "active", isDefaultPassword: false });


      const message: string = "Your Password has been changed successfully. Kindly proceed to Login";
      const token = {
        token: await generateJwtToken(user)
      }
      return { success: true, message: message, data: token}
      
    } catch (error: any) {
      logger.error({error: error.message}, "Error changing password");
    }
  }

  async login(data: { email: string; password: string }) {
    try {
      const user = await this.userRepository.findByEmail(data.email);
      if (!user) {
        throw new AppError(400, "User not found");
      }
  
      if (user.isDefaultPassword === true) {
        return {
          status: false,
          message: "Please change your password from the default password.",
          data: { userId: user.id },
        };
      }
  
      if (user.status === "deactivated") {
        throw new AppError(400, "Your account has been deactivated. Please contact administrator.");
      }
  
      const passwordMatch = await bcryptCompareHashedString(data.password, user.password);
      if (!passwordMatch) {
        throw new AppError(400, "Password is incorrect. Kindly check!");
      }
  
      const accessToken = await generateJwtToken(user);
      const refreshToken = await generateRefreshToken(user);
      await this.userRepository.updateById(user.id, { refreshToken });
  
      try {
        await this.mailService.sendLoginEmail({
          email: user.email,
          subject: "Login Notification",
          name: user.firstName,
        });
      } catch (emailError: any) {
        logger.error({ error: emailError.message }, "Failed to send login notification email");
      }
  
      const role = await this.roleRepo.findByNameWithRelations(user.role);
      const returnResponse = {
        user,
        accessToken,
        permissions: role?.id ? (await this.accessControlManagementService.getRole(role?.id)).permissions : []
      };
  
      return { status: true, message: "Login successful", data: returnResponse };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error logging in");
      return {
        status: false,
        message: error instanceof AppError ? error.message : "Internal server error",
      };
    }
  }
  

  async refreshToken(oldRefreshToken: { refreshToken: string }) {
    try {
      const decoded = jwt.verify(oldRefreshToken.refreshToken, appConfig.jwt_token.secret);
      const user = await this.userRepository.findById(decoded.userId);

      if (!user || user.refreshToken !== oldRefreshToken.refreshToken) {
        throw new AppError(401, "Invalid refresh token");
      }

      const newAccessToken = await generateJwtToken(user);
      return { message: "Token refreshed successfully", data: { accessToken: newAccessToken } };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error refreshing token");
      throw new ServiceUnavailableError("Invalid or expired refresh token"+ error.message)
    }
  }
}


export default AuthService;
