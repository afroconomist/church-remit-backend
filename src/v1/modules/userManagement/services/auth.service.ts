import { injectable } from "tsyringe";
<<<<<<< HEAD
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

=======
import UserRepo from "../repositories/user.repo";
import { addMinutes, isAfter } from "date-fns";
import { generateCode, generateJwtToken } from "@shared/utils/functions.util";
import OTPRepo from "../repositories/otp.repo";
import { resetPasswordMail } from "@shared/mailer/resetPasswordMail";
import OTPService from "./otp.service";
import { bcryptCompareHashedString } from "@shared/utils/hash.util";
import { loginMail } from "@shared/mailer/loginMail";

@injectable()
class AuthService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly otpRepo: OTPRepo,
    private readonly otpService: OTPService,
>>>>>>> 07a06d847cafdcd24c6ae461904bac18c3949e6a
  ) {}

  async forgetPassword(data: { email: string }) {
    try {
<<<<<<< HEAD
      const user = await this.userRepository.findOne({ email: data.email });
      if (!user) {
        throw new AppError(400, "User not found");
      }
      // generate a password reset link
      const token = generateCode(6);
      await this.otpService.sendOTP({user, token, otpType: "password-reset"})
=======
      const user = await this.userRepo.findOne({ email: data.email });
      if (!user) {
        return { success: false, message: "User not found" };
      }
      // generate a password reset link
      const token = generateCode(4);
      
      await this.otpService.sendOTP({user, token, otpType: "password-reset"})

      // const OTP_VALIDITY_DURATION = 10; // OTP valid for 10 minutes
      // const expiryDate = addMinutes(new Date(), OTP_VALIDITY_DURATION);
      // const localExpiryDate = expiryDate.toLocaleString('en-US', { timeZone: 'Africa/Lagos' });

      // const checkUnUsedOTP = await this.otpRepo.findOne({
      //   userId: user.id,
      //   status: 0,
      // });
      // if (checkUnUsedOTP) {
      //   const id = checkUnUsedOTP.id;
      //   await this.otpRepo.updateById(id, {
      //     token: token,
      //     expiringDatetime: expiryDate,
      //   });
      // } else {
      //   await this.otpRepo.save({
      //     userId: user?.id,
      //     token: token,
      //     status: 0,
      //     expiringDatetime: expiryDate,
      //     otpType: "password-reset",
      //   });
      // }

      // //send to the link via email
      // try {
      //   await resetPasswordMail(mail);
      // } catch (e) {
      //   console.log(e);
      // }
>>>>>>> 07a06d847cafdcd24c6ae461904bac18c3949e6a
      return {
        success: true,
        message: `Kindly check your email address ${user.email} for OTP`,
      };
<<<<<<< HEAD
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
      
=======
    } catch (error) {
      console.log(error);
    }
  }

  async confirmOtp(data: { email: string; token: string }) {
    try {
      const user = await this.userRepo.findOne({ email: data.email });
      if (!user) {
        return { success: false, message: "User not found" };
      }

      const checkOtp = await this.otpRepo.findOne({
        userId: user.id,
        status: 0,
      });
>>>>>>> 07a06d847cafdcd24c6ae461904bac18c3949e6a
      if (!checkOtp) {
        return {
          success: false,
          message: "Invalid OTP",
        };
      }
<<<<<<< HEAD
      
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
    
=======
      if (checkOtp.status == 1) {
        return { success: false, message: "Otp has been used" };
      }
      const currentTime = new Date();
      const expirationTime = new Date(checkOtp.expiringDatetime);
      console.log(currentTime, expirationTime)
      if (isAfter(currentTime, expirationTime)) {
        return {
          success: false,
          message: "OTP has expired",
        };
      }
      const id = checkOtp.id;
      await this.otpRepo.updateById(id, { status: 1 });
      return {
        success: true,
        message: "OTP is valid",
      };
    } catch (error) {
      console.log(error);
    }
  }

  async resetPassword(data: { email: string; password: string }) {
    try {
      const user = await this.userRepo.findOne({ email: data.email });
      if (!user) {
        return { success: false, message: "User not found" };
      }

      const checkOtp = await this.otpRepo.findOne({
        userId: user.id,
        status: 1,
      });
      if (!checkOtp) {
        return {
          success: false,
          message: "Kindly request for an OTP to carry out this operation",
        };
      }
  
      const id = checkOtp.id;
      await this.userRepo.updateById(id, { password: data.password });
      await this.otpRepo.updateById(id, { status: 2 });
>>>>>>> 07a06d847cafdcd24c6ae461904bac18c3949e6a
      return {
        success: true,
        message: "Password has been reset successfully",
      };

<<<<<<< HEAD
    } catch (error: any) {
      logger.error({error: error.message}, "Error resetting otp");
=======
    } catch (error) {
      console.log(error);
>>>>>>> 07a06d847cafdcd24c6ae461904bac18c3949e6a
    }
  }

  async changePasswordOnFirstLogin(data: { userId: string; password: string }) {
    try {
<<<<<<< HEAD
      const user = await this.userRepository.findOne({ id: data.userId });
      if (!user) {
        throw new AppError(400, "User not found");
      }

      if(user.isDefaultPassword == false){
        throw new AppError(400, "Can`t perform this action!. Your password has been changed already.");
      }
      const id = user.id;
      
      await this.userRepository.updateById(id, { password: data.password, status: "active", isDefaultPassword: false });
=======
      const user = await this.userRepo.findOne({ id: data.userId });
      if (!user) {
        return { success: false, message: "User not found" };
      }

      if(user.hasChangedPassword == true){
        return { success: false, message: "Can`t perform this action!. Your password has been changed already."}
      }
      const id = user.id;
      
      await this.userRepo.updateById(id, { password: data.password, hasChangedPassword: true });
>>>>>>> 07a06d847cafdcd24c6ae461904bac18c3949e6a


      const message: string = "Your Password has been changed successfully. Kindly proceed to Login";
      const token = {
        token: await generateJwtToken(user)
      }
      return { success: true, message: message, data: token}
      
<<<<<<< HEAD
    } catch (error: any) {
      logger.error({error: error.message}, "Error changing password");
=======
    } catch (error) {
      console.log(error);
>>>>>>> 07a06d847cafdcd24c6ae461904bac18c3949e6a
    }
  }

  async login(data: { email: string; password: string }) {
    try {
<<<<<<< HEAD
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
=======
      const user = await this.userRepo.findByEmail(data.email);
      if (!user) {
        return { success: false, message: "User not found" };
      }

      if(user.hasChangedPassword == "false"){
        const data = {
          reason: "CHANGE_PASSWORD",
          userId: user.id,
        };
        return { success: false, message: "Please change your password from the default password.", data}
      }
      
      if (user.status == "deactivated") {
        return { success: false, message: "Your account has been deactivated. Please contact administrator."}
      }

      const passwordMatch = await bcryptCompareHashedString(data.password, user?.password);
      
      if (!passwordMatch) {
        return { success: false, message: "Password is incorrect. Kindly check!"}
      }

      const token = await generateJwtToken(user);

      try {
        const mail = {
          email: user.email,
          subject: "Login Notification",
          name: user?.name,
        };
        await loginMail(mail);
      } catch (error: any) {}
      const returnResponse = {
        user,
        token: token,
      }
      return { success: true, message: "Login successful", data:returnResponse}

    } catch (error) {
      console.log(error);
>>>>>>> 07a06d847cafdcd24c6ae461904bac18c3949e6a
    }
  }
}


export default AuthService;
