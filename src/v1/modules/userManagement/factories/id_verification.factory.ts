// import { ObjectLiteral } from "@shared/types/object-literal.type";
import { IDVerification } from "../dtos/create-id-verification.dto";
import { IDV } from "../model/id_verification.mdel";


class IDVerificationFactory {
  static idVerification(data: IDVerification) {
    const idVerification = {} as IDV;

    idVerification.userId = data.userId;
    idVerification.issuingDate = data.issuingDate;
    idVerification.expiringDate = data.expiringDate;
    idVerification.idType = data.idType;
    idVerification.idNumber = data.idNumber;
    
    return idVerification;
  }
}

export default IDVerificationFactory;
