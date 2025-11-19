import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { OTP, IOTP } from "../model/otp.mdel";

@injectable()
class OTPRepo extends BaseRepository<IOTP, OTP> {
  constructor() {
    super(OTP);
  }
}

export default OTPRepo;
