import { SuccessResponse, ErrorResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import DocumentService from "../services/document.service";
import httpStatus from "http-status";

@injectable()
class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  uploadDocument = async (req: Request, res: Response) => {
    const result: any = await this.documentService.uploadDocument(req);
    return res
      .status(result.success ? httpStatus.OK : httpStatus.BAD_REQUEST)
      .json(result);
  };

  getAllChurchDocuments = async (req: Request, res: Response) => {
    try {
      const churchDocuments = await this.documentService.getAllChurchDocuments(
        req,
      );
      return res
        .status(httpStatus.OK)
        .send(SuccessResponse("Operation successful", churchDocuments));
    } catch (error: any) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse("Internal Server Error: ", error.message));
    }
  };
}

export default DocumentController;
