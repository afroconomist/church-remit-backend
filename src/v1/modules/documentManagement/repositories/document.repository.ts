import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { Document, IDocument } from "../model/document.model";

@injectable()
class DocumentRepository extends BaseRepository<IDocument, Document> {
  constructor() {
    super(Document);
  }
}

export default DocumentRepository;
