import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { Church, IChurch } from "../model/church.model";

@injectable()
class ChurchRepository extends BaseRepository<IChurch, Church> {
  constructor() {
    super(Church);
  }
}

export default ChurchRepository;
