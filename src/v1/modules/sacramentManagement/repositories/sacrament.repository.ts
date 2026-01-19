import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { Sacrament, ISacrament } from "../model/sacrament.model";

@injectable()
class SacramentRepository extends BaseRepository<ISacrament, Sacrament> {
  constructor() {
    super(Sacrament);
  }
}

export default SacramentRepository;
