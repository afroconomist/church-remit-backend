import { CreateAnnouncement } from "../dtos/create-announcement.dto";
import { IAnnouncement } from "../model/announcement.model";

class AnnouncementFactory {
  static createAnnouncement(data: CreateAnnouncement) {
    const announcement = {} as IAnnouncement;

    announcement.title = data.title;
    announcement.content = data.content;
    announcement.category = data.category;
    announcement.priority = data.priority;
    announcement.startDate = data.startDate;
    announcement.endDate = data.endDate;
    announcement.displayOnWebsite = data.displayOnWebsite;
    announcement.sendEmailNotification = data.sendEmailNotification;
    announcement.sendSMSNotification = data.sendSMSNotification;
    announcement.campusId = data.campusId;
    announcement.churchId = data.churchId;

    return announcement;
  }
}

export default AnnouncementFactory;
