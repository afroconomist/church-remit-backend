import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { AuditTrail, IAuditTrail } from "../model/external-service.model";

@injectable()
class AuditTrailRepo extends BaseRepository<IAuditTrail, AuditTrail> {
  constructor() {
    super(AuditTrail);
  }
}

export default AuditTrailRepo;
