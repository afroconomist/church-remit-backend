import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { Prayer, IPrayer } from "../model/prayer.model";

@injectable()
class PrayerRepository extends BaseRepository<IPrayer, Prayer> {
  constructor() {
    super(Prayer);
  }
}

export default PrayerRepository;
