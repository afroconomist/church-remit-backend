import { injectable } from "tsyringe";
import { BaseRepository } from "../repositories/base.repo";
import { VolunteerRoleAssignment } from "../model/volunteer_role_assignment.model";

@injectable()
class VolunteerRoleAssignmentRepository extends BaseRepository<
  VolunteerRoleAssignment,
  VolunteerRoleAssignment
> {
  constructor() {
    super(VolunteerRoleAssignment);
  }
}

export default VolunteerRoleAssignmentRepository;
