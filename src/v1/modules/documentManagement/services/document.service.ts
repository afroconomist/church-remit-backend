import { injectable } from "tsyringe";
import { UploadDocument } from "../dtos/upload-document.dto";
import DocumentFactory from "../factories/doument.factory";
import DocumentRepository from "../repositories/document.repository";
import UserRepository from "../../userManagement/repositories/user.repository";
import logger from "@shared/utils/logger";
import AppError from "@shared/error/app.error";

@injectable()
class DocumentService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async uploadDocument(data: UploadDocument, superAdminId: string) {
    try {
      const superAdmin = await this.userRepository.findById(superAdminId);
      if (!superAdmin) throw new AppError(400, "Super admin does not exist");

      const document = DocumentFactory.uploadDocument({
        documentName: data.documentName,
        category: data.category,
        confidentiality: data.confidentiality,
        documentFile: data.documentFile,
        churchId: String(superAdmin.churchId),
      });
      const uploadedDocument = await this.documentRepository.save(document);

      return {
        success: true,
        message: "Document has been uploaded successfully",
        document: uploadedDocument,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error uploading a document");
      throw new AppError(
        400,
        error.message ||
          "An unexpected error occurred while uploading a document",
      );
    }
  }

  async getAllChurchDocuments(req: any) {
    const churchId = req.params.churchId;
    const { page, limit } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const { data: churchDocuments, totalRecords } =
        await this.documentRepository.findAndCountAll(
          { churchId },
          page,
          limit,
        );

      if (churchDocuments.length === 0) {
        return {
          churchDocuments: [],
          total_result: 0,
          current_page: currentPage,
          total_pages: 0,
        };
      }

      const totalPages = Math.ceil(totalRecords / pageSize);
      return {
        churchDocuments,
        total_result: totalRecords,
        current_page: currentPage,
        total_pages: totalPages,
      };
    } catch (error: any) {
      logger.error({ error: "Error fetching all church documents" });
      throw new Error(
        "An unexpected error occurred while fetching all church documents.",
      );
    }
  }
}

export default DocumentService;
