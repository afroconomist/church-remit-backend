import { CreateNewEvent } from "../dtos/create-new-event.dto";
import { IChurchEvent } from "../model/event.model";

class EventFactory {
  static createNewEvent(data: CreateNewEvent) {
    const event = {} as IChurchEvent;

    event.eventTitle = data.eventTitle;
    event.description = data.description;
    event.category = data.category;
    event.location = data.location;
    event.eventDate = data.eventDate;
    event.nextEventDate = data.nextEventDate;
    event.eventStartTime = data.eventStartTime;
    event.eventEndTime = data.eventEndTime;
    event.maximumCapacity = data.maximumCapacity;
    event.maximumCapacityTracker = data.maximumCapacityTracker;
    event.registration = data.registration;
    event.recurring = data.recurring;
    event.eventFrequency = data.eventFrequency;
    event.church = data.church;
    event.campusId = data.campusId;

    return event;
  }
}

export default EventFactory;
