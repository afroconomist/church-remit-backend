import { CreateChurchAndUser } from "../dtos/create-church-and-user.dto";
import { IChurch } from "../model/church.model";

class ChurchFactory {
  static createChurch(data: CreateChurchAndUser) {
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
    church.digitalGivingAndDonations = data.digitalGivingAndDonations;
    church.expenseManagement = data.expenseManagement;
    church.payrollManagement = data.payrollManagement;
    church.memberManagement = data.memberManagement;
    church.digitalGiving = data.digitalGiving;
    church.eventsAndCheckIn = data.eventsAndCheckIn;
    church.smallGroups = data.smallGroups;
    church.volunteerManagement = data.volunteerManagement;
    church.communications = data.communications;
    church.facilities = data.facilities;
    church.mediaLibrary = data.mediaLibrary;

    return church;
  }
}

export default ChurchFactory;
