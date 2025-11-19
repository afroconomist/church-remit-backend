import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { IDVerification, IDV } from "../model/id_verification.mdel";

@injectable()
class IDVerificationRepo extends BaseRepository<IDV, IDVerification> {
  constructor() {
    super(IDVerification);
  }
}

export default IDVerificationRepo;
