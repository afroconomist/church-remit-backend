export type AddNewFacility = {
  facilityName: string;
  facilityType: string;
  capacity: number;
  location: string;
  features: Text;
  status?: string;
  eventBookedFor?: string;
  eventTime?: string;
  campusId?: string;
  churchId: string;
};
