import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import {
  FacilityBooking,
  IFacilityBooking,
} from "../model/facility_booking.model";

@injectable()
class FacilityBookingRepository extends BaseRepository<
  IFacilityBooking,
  FacilityBooking
> {
  constructor() {
    super(FacilityBooking);
  }
}

export default FacilityBookingRepository;
