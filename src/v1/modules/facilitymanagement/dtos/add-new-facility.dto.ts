export type AddNewFacility = {
  facilityName: string;
  facilityType: string;
  capacity: number;
  location: string;
  features: Text;
  status?: string;
  eventBookedFor?: string;
  eventTime?: string;
  churchId: string;
};
