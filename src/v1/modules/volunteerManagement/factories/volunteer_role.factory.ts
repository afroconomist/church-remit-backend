import { CreateVolunteerRole } from "../dtos/create-volunteer-role.dto";
import { IVolunteerRole } from "../model/volunteer_role.model";

class VolunteerRoleFactory {
  static createVolunteerRole(data: CreateVolunteerRole) {
    const volunteerRole = {} as IVolunteerRole;

    volunteerRole.name = data.name;
    volunteerRole.section = data.section;
    volunteerRole.noOfVolunteersNeeded = data.noOfVolunteersNeeded;
    volunteerRole.eventId = data.eventId;
    volunteerRole.church = data.church;
    volunteerRole.groupId = data.groupId;

    return volunteerRole;
  }
}

export default VolunteerRoleFactory;
