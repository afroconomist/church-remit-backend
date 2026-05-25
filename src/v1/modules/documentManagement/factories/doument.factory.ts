import { UploadDocument } from "../dtos/upload-document.dto";
import { IDocument } from "../model/document.model";

class DocumentFactory {
  static uploadDocument(data: UploadDocument) {
    const document = {} as IDocument;

    document.documentName = data.documentName;
    document.category = data.category;
    document.confidentiality = data.confidentiality;
    document.documentUrl = data.documentUrl;
    document.campusId = data.campusId;
    document.churchId = data.churchId;

    return document;
  }
}

export default DocumentFactory;
