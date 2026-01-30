import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { Campus, ICampus } from "../model/campus.model";

@injectable()
class CampusRepository extends BaseRepository<ICampus, Campus> {
  constructor() {
    super(Campus);
  }
}

export default CampusRepository;
