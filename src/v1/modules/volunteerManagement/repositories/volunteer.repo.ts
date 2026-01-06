import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { Volunteer, IVolunteer } from "../model/volunteer.model";

@injectable()
class VolunteerRepository extends BaseRepository<IVolunteer, Volunteer> {
  constructor() {
    super(Volunteer);
  }
}

export default VolunteerRepository;
