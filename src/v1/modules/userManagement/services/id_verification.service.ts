import { injectable } from "tsyringe";
import IDVerificationFactory from "../factories/id_verification.factory";
import IdVerificationRepository from "../repositories/id_verification.repository";
import logger from "@shared/utils/logger";
@injectable()
class IDVerificationService {
  constructor(private readonly idVerificationRepository: IdVerificationRepository) {}

  async idVerification(data: { userId: string; idNumber: string; idType: string }) {
    try {
      const result = {
        userId: data.userId,
        issuingDate: "20-10-2009",
        expiringDate: "20-10-2029",
        idType: data.idType,
        idNumber: data.idNumber,
      };
  
      const logID = await this.logVerification(result);
  
      return logID;
    } catch (error: any) {
      logger.error({ error: error.message }, "Error Verifying ID")
      throw new Error(`ID verification failed: ${error.message}`);
    }
  }
  

  async logVerification(data) {
    const user = IDVerificationFactory.idVerification(data);
    try {
      const logID = await this.idVerificationRepository.save(user);
  
      return logID;
    } catch (error: any) {
      logger.error({ error: error.message }, "Error verifying ID")
      throw new Error(`Logging verification failed: ${error.message}`);
    }
  }
}
  

export default IDVerificationService;
