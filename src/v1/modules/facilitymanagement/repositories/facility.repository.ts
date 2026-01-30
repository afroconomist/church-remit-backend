import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { Facility, IFacility } from "../model/facility.model";

@injectable()
class FacilityRepository extends BaseRepository<IFacility, Facility> {
  constructor() {
    super(Facility);
  }
}

export default FacilityRepository;
