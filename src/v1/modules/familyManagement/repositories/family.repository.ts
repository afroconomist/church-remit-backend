import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { Family, IFamily } from "../model/family.model";

@injectable()
class FamilyRepository extends BaseRepository<IFamily, Family> {
  constructor() {
    super(Family);
  }
}

export default FamilyRepository;
