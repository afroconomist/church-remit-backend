import { VolunteerForEvent } from "../dtos/volunteer-for-event.dto";
import { IEventVolunteer } from "../model/event_volunteer.model";

class EventVolunteerFactory {
  static volunteerForEvent(data: VolunteerForEvent) {
    const eventVolunteer = {} as IEventVolunteer;

    eventVolunteer.name = data.name;
    eventVolunteer.email = data.email;
    eventVolunteer.phoneNumber = data.phoneNumber;
    eventVolunteer.role = data.role;
    eventVolunteer.churchEvent = data.churchEvent;

    return eventVolunteer;
  }
}

export default EventVolunteerFactory;
