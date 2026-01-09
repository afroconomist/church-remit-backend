import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { EventAttendee, IEventAttendee } from "../model/event_attendee.model";

@injectable()
class EventAttendeeRepository extends BaseRepository<
  IEventAttendee,
  EventAttendee
> {
  constructor() {
    super(EventAttendee);
  }
}

export default EventAttendeeRepository;
