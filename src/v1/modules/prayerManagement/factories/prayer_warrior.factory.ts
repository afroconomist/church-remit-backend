import { AddPrayerWarrior } from "../dtos/add-prayer-warrior.dto";
import { IPrayerWarrior } from "../model/prayer_warrior.model";

class PrayerWarriorFactory {
  static addPrayerWarrior(data: AddPrayerWarrior) {
    const prayerWarrior = {} as IPrayerWarrior;

    prayerWarrior.name = data.name;
    prayerWarrior.email = data.email;
    prayerWarrior.phoneNumber = data.phoneNumber;
    prayerWarrior.assigned = data.assigned;
    prayerWarrior.completed = data.completed;
    prayerWarrior.avgResponse = data.avgResponse;
    prayerWarrior.campusId = data.campusId;
    prayerWarrior.church = data.church;
    prayerWarrior.churchMemberId = data.churchMemberId;

    return prayerWarrior;
  }
}

export default PrayerWarriorFactory;
