import { AddNewVolunteer } from "../dtos/add-new-volunteer.dto";
import { IVolunteer } from "../model/volunteer.model";

class VolunteerFactory {
  static addNewVolunteer(data: AddNewVolunteer) {
    const volunteer = {} as IVolunteer;

    volunteer.name = data.name;
    volunteer.email = data.email;
    volunteer.phoneNumber = data.phoneNumber;
    volunteer.skills = data.skills;
    volunteer.availability = data.availability;
    volunteer.memberSince = data.memberSince;
    volunteer.campusId = data.campusId;
    volunteer.church = data.church;
    volunteer.churchMemberId = data.churchMemberId;

    return volunteer;
  }
}

export default VolunteerFactory;
