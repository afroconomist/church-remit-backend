import { AddNewFacility } from "../dtos/add-new-facility.dto";
import { IFacility } from "../model/facility.model";

class FacilityFactory {
  static addNewFacility(data: AddNewFacility) {
    const facility = {} as IFacility;

    facility.facilityName = data.facilityName;
    facility.facilityType = data.facilityType;
    facility.capacity = data.capacity;
    facility.location = data.location;
    facility.features = data.features;
    facility.status = data.status;
    facility.eventBookedFor = data.eventBookedFor;
    facility.eventTime = data.eventTime;
    facility.churchId = data.churchId;

    return facility;
  }
}

export default FacilityFactory;
