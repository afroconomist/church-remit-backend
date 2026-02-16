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
    event.startTime = data.startTime;
    event.endTime = data.endTime;
    event.maximumCapacity = data.maximumCapacity;
    event.maximumCapacityTracker = data.maximumCapacityTracker;
    event.registration = data.registration;
    event.recurring = data.recurring;
    event.church = data.church;

    return event;
  }
}

export default EventFactory;
