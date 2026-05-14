import express, { Request, Response } from "express";
import { container } from "tsyringe";
import DocumentController from "../controller/document.controller";
import accessControlMiddleware from "@shared/middlewares/access-control.middleware";
import { AccessControls } from "../../accessControlManagement/enums/access-control.enum";
import authMiddleware from "@shared/middlewares/auth.middleware";
import { uploadMiddleware } from "@shared/utils/files";

const documentController = container.resolve(DocumentController);

const router = express.Router();

router.post(
  "/documents/upload",
  [
    authMiddleware,
    uploadMiddleware.single("file"),
    accessControlMiddleware(AccessControls.DOCUMENT_UPLOAD),
  ],
  (req: Request, res: Response, next) =>
    documentController.uploadDocument(req, res).catch((err) => next(err)),
);

router.get(
  "/:churchId/documents",
  [authMiddleware, accessControlMiddleware(AccessControls.DOCUMENT_LIST)],
  (req: Request, res: Response, next) =>
    documentController
      .getAllChurchDocuments(req, res)
      .catch((err) => next(err)),
);

export default router;
