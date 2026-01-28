import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import {
  CampusPersonnel,
  ICampusPersonnel,
} from "../model/campus_personnel.model";

@injectable()
class CampusPersonnelRepository extends BaseRepository<
  ICampusPersonnel,
  CampusPersonnel
> {
  constructor() {
    super(CampusPersonnel);
  }
}

export default CampusPersonnelRepository;
