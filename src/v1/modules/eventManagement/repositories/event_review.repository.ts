import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { EventReview, IEventReview } from "../model/event_review.model";

@injectable()
class EventReviewRepository extends BaseRepository<IEventReview, EventReview> {
  constructor() {
    super(EventReview);
  }
}

export default EventReviewRepository;
