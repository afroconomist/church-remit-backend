import { injectable } from "tsyringe";
import SacramentFactory from "../factories/sacrament.factory";
import SacramentRepository from "../repositories/sacrament.repository";
import UserRepository from "../../userManagement/repositories/user.repository";
import MemberRepository from "../../memberManagement/repositories/member.repository";
import { RecordSacrament } from "../dtos/record-sacrament.dto";
import logger from "@shared/utils/logger";
import AppError from "@shared/error/app.error";

@injectable()
class SacramentService {
  constructor(
    private readonly sacramentRepository: SacramentRepository,
    private readonly userRepository: UserRepository,
    private readonly memberRepository: MemberRepository,
  ) {}

  async recordSacrament(data: RecordSacrament, adminId: string) {
    try {
      const [superAdmin, campusAdmin] = await Promise.all([
        this.userRepository.findById(adminId),
        this.memberRepository.findById(adminId),
      ]);
      const admin = superAdmin ? superAdmin : campusAdmin;

      let campusId;
      if (data.campusId || data.campusId === null) {
        campusId = data.campusId;
      } else {
        campusId = admin.campusId;
      }
      const sacrament = SacramentFactory.recordSacrament({
        sacramentType: data.sacramentType,
        memberName: data.memberName,
        dateOfSacrament: data.dateOfSacrament,
        officiatingMinister: data.officiatingMinister,
        parentsGuardians: data.parentsGuardians,
        sponsorsGodparentsWitnesses: data.sponsorsGodparentsWitnesses,
        additionalNotes: data.additionalNotes,
        campusId,
        church: String(admin.churchId),
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
    const { page, limit, campusId } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const filter: any = { church: churchId };
      if (campusId) {
        filter.campusId = campusId;
      }

      const { data: churchSacraments, totalRecords } =
        await this.sacramentRepository.findAndCountAll(
          filter,
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
