import { CreateChurch } from "../dtos/create-church-and-user.dto";
import { IChurch } from "../model/church.model";

class ChurchFactory {
  static createChurch(data: CreateChurch) {
    const church = {} as IChurch;

    church.churchName = data.churchName;
    church.churchType = data.churchType;
    church.email = data.email;
    church.phoneNumber = data.phoneNumber;
    church.website = data.website;
    church.streetAddress = data.streetAddress;
    church.city = data.city;
    church.stateRegion = data.stateRegion;
    church.country = data.country;
    church.timeZone = data.timeZone;
    church.baseCurrency = data.baseCurrency;
    church.fiscalYearStart = data.fiscalYearStart;
    church.initialFundsToCreate = data.initialFundsToCreate;

    return church;
  }
}

export default ChurchFactory;
