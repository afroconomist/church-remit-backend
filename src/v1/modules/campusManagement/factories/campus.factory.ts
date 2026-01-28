import { AddCampus } from "../dtos/add-campus.dto";
import { ICampus } from "../model/campus.model";

class CampusFactory {
  static addCampus(data: AddCampus) {
    const campus = {} as ICampus;

    campus.campusName = data.campusName;
    campus.campusCode = data.campusCode;
    campus.campusAddress = data.campusAddress;
    campus.campusEmail = data.campusEmail;
    campus.campusPhoneNumber = data.campusPhoneNumber;
    campus.campusPastor = data.campusPastor;
    campus.financeManager = data.financeManager;
    campus.legalName = data.legalName;
    campus.taxId = data.taxId;
    campus.registrationNumber = data.registrationNumber;
    campus.localCurrency = data.localCurrency;
    campus.timezone = data.timezone;
    campus.established = data.established;
    campus.status = data.status;
    campus.churchId = data.churchId;

    return campus;
  }
}

export default CampusFactory;
