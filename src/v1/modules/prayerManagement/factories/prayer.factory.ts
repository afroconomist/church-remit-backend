import { SubmitPrayerRequest } from "../dtos/submit-prayer-request.dto";
import { IPrayer } from "../model/prayer.model";

class PrayerFactory {
  static submitPrayerRequest(data: SubmitPrayerRequest) {
    const prayer = {} as IPrayer;

    prayer.requestTitle = data.requestTitle;
    prayer.description = data.description;
    prayer.category = data.category;
    prayer.urgency = data.urgency;
    prayer.privacySetting = data.privacySetting;
    prayer.assignedTo = data.assignedTo;
    prayer.pray = data.pray;
    prayer.submittedBy = data.submittedBy;
    prayer.prayerWarrior = data.prayerWarrior;
    prayer.answered = data.answered;
    prayer.church = data.church;

    return prayer;
  }
}

export default PrayerFactory;
