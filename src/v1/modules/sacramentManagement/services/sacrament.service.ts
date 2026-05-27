import { injectable } from "tsyringe";
import SacramentFactory from "../factories/sacrament.factory";
import SacramentRepository from "../repositories/sacrament.repository";
import UserRepository from "../../userManagement/repositories/user.repository";
import { RecordSacrament } from "../dtos/record-sacrament.dto";
import logger from "@shared/utils/logger";
import AppError from "@shared/error/app.error";

@injectable()
class SacramentService {
  constructor(
    private readonly sacramentRepository: SacramentRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async recordSacrament(data: RecordSacrament, memberId: string) {
    try {
      const member = await this.userRepository.findById(memberId);
      if (!member) throw new AppError(400, "Member does not exist");

      const sacrament = SacramentFactory.recordSacrament({
        sacramentType: data.sacramentType,
        memberName: data.memberName,
        dateOfSacrament: data.dateOfSacrament,
        officiatingMinister: data.officiatingMinister,
        parentsGuardians: data.parentsGuardians,
        sponsorsGodparentsWitnesses: data.sponsorsGodparentsWitnesses,
        additionalNotes: data.additionalNotes,
        campusId: String(data.campusId),
        church: String(member.churchId),
      });
      const recordedSacrament = await this.sacramentRepository.save(sacrament);

      return {
        success: true,
        message: "Sacrament has been recorded successfully",
        sacrament: recordedSacrament,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error recording sacrament");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while recording sacrament",
      );
    }
  }

  async getChurchSacraments(req: any) {
    const churchId = req.params.churchId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: churchSacraments, totalRecords } =
        await this.sacramentRepository.findAndCountAll(
          { church: churchId },
          currentPage,
          pageSize,
        );

      if (churchSacraments.length === 0) {
        return {
          churchSacraments: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchSacraments,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching all church sacraments" });
      throw new Error(
        "An unexpected error occurred while fetching all church sacraments.",
      );
    }
  }
}

export default SacramentService;
