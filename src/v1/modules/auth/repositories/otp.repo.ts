import { injectable } from "tsyringe";
import { BaseRepository } from "../../userManagement/repositories/base.repo";
import { OTP, IOTP } from "../model/otp.model";

@injectable()
class OTPRepo extends BaseRepository<IOTP, OTP> {
  constructor() {
    super(OTP);
  }
}

export default OTPRepo;
