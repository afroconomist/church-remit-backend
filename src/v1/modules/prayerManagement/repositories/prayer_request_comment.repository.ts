import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import {
  PrayerRequestComment,
  IPrayerRequestComment,
} from "../model/prayer_request_comment.model";

@injectable()
class PrayerRequestCommentRepository extends BaseRepository<
  IPrayerRequestComment,
  PrayerRequestComment
> {
  constructor() {
    super(PrayerRequestComment);
  }
}

export default PrayerRequestCommentRepository;
