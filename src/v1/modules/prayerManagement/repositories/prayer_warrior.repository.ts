import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { PrayerWarrior, IPrayerWarrior } from "../model/prayer_warrior.model";

@injectable()
class PrayerWarriorRepository extends BaseRepository<
  IPrayerWarrior,
  PrayerWarrior
> {
  constructor() {
    super(PrayerWarrior);
  }
}

export default PrayerWarriorRepository;
