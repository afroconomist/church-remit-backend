import events from "@shared/events";
import logger from "@shared/utils/logger";
import { EventSubscriber, On } from "event-dispatch";
import AuditTrailService from "../../v1/modules/moduleName/services/audit-trail.service";
import { container } from "tsyringe";
import { CreateAuditTrail } from "../../v1/modules/moduleName/dtos/create-audit-trail.dto";

@EventSubscriber()
export class AuditLogSubscriber {
  private readonly auditTrailService: AuditTrailService;

  constructor() {
    this.auditTrailService = container.resolve(AuditTrailService);
  }

  @On(events.auditTrail.logActivity)
  async execute(data: CreateAuditTrail) {
    logger.info({ data }, "AuditLogSubscriber: execution");

    this.auditTrailService.createAuditTrail(data);
  }
}
