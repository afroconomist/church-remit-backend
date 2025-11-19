import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { IdVerification, IDV } from "../model/id_verification.model";

@injectable()
class IdVerificationRepository extends BaseRepository<IDV, IdVerification> {
  constructor() {
    super(IdVerification);
  }
}

export default IdVerificationRepository;