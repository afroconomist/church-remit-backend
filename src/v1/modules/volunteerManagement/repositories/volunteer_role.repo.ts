import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { VolunteerRole, IVolunteerRole } from "../model/volunteer_role.model";

@injectable()
class VolunteerRoleRepository extends BaseRepository<
  IVolunteerRole,
  VolunteerRole
> {
  constructor() {
    super(VolunteerRole);
  }
}

export default VolunteerRoleRepository;
