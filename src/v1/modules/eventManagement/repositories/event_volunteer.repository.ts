import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import {
  EventVolunteer,
  IEventVolunteer,
} from "../model/event_volunteer.model";

@injectable()
class EventVolunteerRepository extends BaseRepository<
  IEventVolunteer,
  EventVolunteer
> {
  constructor() {
    super(EventVolunteer);
  }
}

export default EventVolunteerRepository;
