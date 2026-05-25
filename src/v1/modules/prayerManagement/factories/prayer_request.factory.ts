import { SubmitPrayerRequest } from "../dtos/submit-prayer-request.dto";
import { IPrayerRequest } from "../model/prayer_request.model";

class PrayerRequestFactory {
  static submitPrayerRequest(data: SubmitPrayerRequest) {
    const prayerRequest = {} as IPrayerRequest;

    prayerRequest.requestTitle = data.requestTitle;
    prayerRequest.description = data.description;
    prayerRequest.category = data.category;
    prayerRequest.urgency = data.urgency;
    prayerRequest.privacySetting = data.privacySetting;
    prayerRequest.assignedTo = data.assignedTo;
    prayerRequest.pray = data.pray;
    prayerRequest.submittedBy = data.submittedBy;
    prayerRequest.prayerWarrior = data.prayerWarrior;
    prayerRequest.answered = data.answered;
    prayerRequest.campusId = data.campusId;
    prayerRequest.church = data.church;

    return prayerRequest;
  }
}

export default PrayerRequestFactory;
