import { SubmitReview } from "../dtos/submit-review.dto";
import { IEventReview } from "../model/event_review.model";

class EventReviewFactory {
  static submitReview(data: SubmitReview) {
    const eventReview = {} as IEventReview;

    eventReview.submittedBy = data.submittedBy;
    eventReview.eventReview = data.eventReview;
    eventReview.churchEvent = data.churchEvent;

    return eventReview;
  }
}

export default EventReviewFactory;
