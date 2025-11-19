import { Response } from "express";
import { injectable } from "tsyringe";
import HealthService from "./health.service";

@injectable()
class HealthController {
  constructor(private healthService: HealthService) {}

  readinessCheck = async (res: Response) => {
    await this.healthService.readinessCheck(res);
  };

  livelinessCheck = async (res: Response) => {
    await this.healthService.livelinessCheck(res);
  };
}

export default HealthController;
