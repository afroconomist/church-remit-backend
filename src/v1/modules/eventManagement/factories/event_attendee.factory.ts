import { RegisterForEvent } from "../dtos/register-for-event.dto";
import { IEventAttendee } from "../model/event_attendee.model";

class EventAttendeeFactory {
  static registerForEvent(data: RegisterForEvent) {
    const eventAttendee = {} as IEventAttendee;

    eventAttendee.name = data.name;
    eventAttendee.churchEvent = data.churchEvent;

    return eventAttendee;
  }
}

export default EventAttendeeFactory;
