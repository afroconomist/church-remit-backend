import { AddNewAgenda } from "../dtos/add-agenda.dto";
import { IEventAgenda } from "../model/event_agenda.model";

class EventAgendaFactory {
  static addNewAgenda(data: AddNewAgenda) {
    const eventAgenda = {} as IEventAgenda;

    eventAgenda.time = data.time;
    eventAgenda.duration = data.duration;
    eventAgenda.title = data.title;
    eventAgenda.description = data.description;
    eventAgenda.assignedTo = data.assignedTo;
    eventAgenda.role = data.role;
    eventAgenda.churchEvent = data.churchEvent;

    return eventAgenda;
  }
}

export default EventAgendaFactory;
