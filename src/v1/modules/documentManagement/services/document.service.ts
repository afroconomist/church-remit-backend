import { injectable } from "tsyringe";
import DocumentFactory from "../factories/doument.factory";
import DocumentRepository from "../repositories/document.repository";
import UserRepository from "../../userManagement/repositories/user.repository";
import MemberRepository from "../../memberManagement/repositories/member.repository";
import logger from "@shared/utils/logger";
import AppError from "@shared/error/app.error";
import { uploadFileToS3 } from "@shared/utils/file-upload.util";

@injectable()
class DocumentService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly userRepository: UserRepository,
    private readonly memberRepository: MemberRepository,
  ) {}

  async uploadDocument(req: any) {
    const file = req.file;
    const adminId = req.user.id;
    const { category, confidentiality, campusId } = req.body;

    if (!file) {
      throw new AppError(400, "No file uploaded");
    }

    if (!category || !confidentiality) {
      return {
        success: false,
        message: "Category and confidentiality are required",
      };
    }

    try {
      const [superAdmin, campusAdmin] = await Promise.all([
        this.userRepository.findById(adminId),
        this.memberRepository.findById(adminId),
      ]);
      const admin = superAdmin ? superAdmin : campusAdmin;

      const fileData = await uploadFileToS3(
        file,
        `documents/${file.originalname}`,
      );
      if (!fileData) {
        throw new AppError(400, "Document upload failed");
      }

      let campusId_;
      if (campusId || campusId === null) {
        campusId_ = campusId;
      } else {
        campusId_ = admin.campusId;
      }
      const document = DocumentFactory.uploadDocument({
        documentName: fileData.key,
        category,
        confidentiality,
        documentUrl: fileData.url,
        campusId: campusId_,
        churchId: String(admin.churchId),
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
    const { page, limit, campusId } = req.query;

    const pageSize = parseInt(limit, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;

    try {
      const filter: any = { churchId };
      if (campusId) {
        filter.campusId = campusId;
      }

      const { data: churchDocuments, totalRecords } =
        await this.documentRepository.findAndCountAll(
          filter,
          currentPage,
          pageSize,
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
