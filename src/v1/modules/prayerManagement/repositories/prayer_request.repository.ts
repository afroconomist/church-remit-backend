import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { PrayerRequest, IPrayerRequest } from "../model/prayer_request.model";

@injectable()
class PrayerRequestRepository extends BaseRepository<
  IPrayerRequest,
  PrayerRequest
> {
  constructor() {
    super(PrayerRequest);
  }
}

export default PrayerRequestRepository;
