import { injectable } from "tsyringe";
import { addMinutes } from "date-fns";
import OTPRepo from "../../auth/repositories/otp.repo";

@injectable()
class OTPService {
  constructor(private readonly otpRepo: OTPRepo) {}

  async sendOTP(data: { userId: string; token: string; otpType: string }) {
    const OTP_VALIDITY_DURATION = 10;
    const expiryDate = addMinutes(new Date(), OTP_VALIDITY_DURATION);
    const checkUnUsedOTP = await this.otpRepo.findOne({
      userId: data.userId,
      status: "pending",
    });
    if (checkUnUsedOTP) {
      const id = checkUnUsedOTP.id;
      await this.otpRepo.updateById(id, {
        token: data.token,
        expiringDatetime: expiryDate,
      });
    } else {
      await this.otpRepo.save({
        userId: data.userId,
        token: data.token,
        expiringDatetime: expiryDate,
        otpType: data.otpType,
      });
    }

    // const mail = {
    //   name: data.user?.firstName,
    //   email: data.user.email,
    //   subject: "Password Reset Notification",
    //   otp: data.token,
    // };
    // try {
    //   await resetPasswordMail(mail);
    // } catch (e) {
    //   console.log(e);
    // }
  }
}

export default OTPService;
