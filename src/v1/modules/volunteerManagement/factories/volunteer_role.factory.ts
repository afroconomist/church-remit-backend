import { CreateVolunteerRole } from "../dtos/create-volunteer-role.dto";
import { IVolunteerRole } from "../model/volunteer_role.model";

class VolunteerRoleFactory {
  static createVolunteerRole(data: CreateVolunteerRole) {
    const volunteerRole = {} as IVolunteerRole;

    volunteerRole.name = data.name;
    volunteerRole.section = data.section;
    volunteerRole.scheduledDate = data.scheduledDate;
    volunteerRole.noOfVolunteersNeeded = data.noOfVolunteersNeeded;
    volunteerRole.startTime = data.startTime;
    volunteerRole.endTime = data.endTime;
    volunteerRole.church = data.church;

    return volunteerRole;
  }
}

export default VolunteerRoleFactory;
