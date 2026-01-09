import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { ChurchEvent, IChurchEvent } from "../model/event.model";

@injectable()
class EventRepository extends BaseRepository<IChurchEvent, ChurchEvent> {
  constructor() {
    super(ChurchEvent);
  }
}

export default EventRepository;
