import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { Announcement, IAnnouncement } from "../model/announcement.model";

@injectable()
class AnnouncementRepository extends BaseRepository<
  IAnnouncement,
  Announcement
> {
  constructor() {
    super(Announcement);
  }
}

export default AnnouncementRepository;
