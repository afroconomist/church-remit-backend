import express, { Response } from "express";
import { container } from "tsyringe";
import AuditTrailController from "../controller/audit-trail.controller";

const auditTrailController = container.resolve(AuditTrailController);
const router = express.Router();

router.get("/audit-trails", (res: Response) => {
  auditTrailController.getAll(res);
});

export default router;
