import { injectable } from "tsyringe";
import { addMinutes } from "date-fns";
import OTPRepo from "../repositories/otp.repo";
import { resetPasswordMail } from "@shared/mailer/resetPasswordMail";
import { IUser } from "../model/user.model";


@injectable()
class OTPService {
  constructor(private readonly otpRepo: OTPRepo) {}

  async sendOTP(data: { user: IUser, token: string, otpType: string }) {
    const OTP_VALIDITY_DURATION = 10;
      const expiryDate = addMinutes(new Date(), OTP_VALIDITY_DURATION);
      const checkUnUsedOTP = await this.otpRepo.findOne({
        userId: data.user.id,
        status: 0,
      });
      if (checkUnUsedOTP) {
        const id = checkUnUsedOTP.id;
        await this.otpRepo.updateById(id, {
          token: data.token,
          expiringDatetime: expiryDate,
        });
      } else {
        await this.otpRepo.save({
          userId: data.user.id,
          token: data.token,
          status: 0,
          expiringDatetime: expiryDate,
          otpType: data.otpType,
        });
      }

      const mail = {
        name: data.user?.firstName,
        email: data.user.email,
        subject: "Password Reset Notification",
        otp: data.token,
      };
      try {
        await resetPasswordMail(mail);
      } catch (e) {
        console.log(e);
      }
  }
}

export default OTPService;
