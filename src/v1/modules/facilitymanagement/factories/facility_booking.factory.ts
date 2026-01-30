import { BookFacility } from "../dtos/book-facility.dto";
import { IFacilityBooking } from "../model/facility_booking.model";

class FacilityBookingFactory {
  static bookFacility(data: BookFacility) {
    const facilityBooking = {} as IFacilityBooking;

    facilityBooking.eventName = data.eventName;
    facilityBooking.startTime = data.startTime;
    facilityBooking.endTime = data.endTime;
    facilityBooking.purpose = data.purpose;
    facilityBooking.facilityId = data.facilityId;

    return facilityBooking;
  }
}

export default FacilityBookingFactory;
