import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { OTP, IOTP } from "../model/otp.model";

@injectable()
class OtpRepository extends BaseRepository<IOTP, OTP> {
  constructor() {
    super(OTP);
  }
}

export default OtpRepository;
