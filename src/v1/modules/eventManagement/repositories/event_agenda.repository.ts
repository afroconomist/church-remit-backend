import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { EventAgenda, IEventAgenda } from "../model/event_agenda.model";

@injectable()
class EventAgendaRepository extends BaseRepository<IEventAgenda, EventAgenda> {
  constructor() {
    super(EventAgenda);
  }
}

export default EventAgendaRepository;
