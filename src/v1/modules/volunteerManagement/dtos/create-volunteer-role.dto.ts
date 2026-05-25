export type CreateVolunteerRole = {
  event_id: string;
  name: string;
  section: string;
  noOfVolunteersNeeded: number;
  eventId: string;
  campusId?: string;
  church: string;
  groupId?: string;
};
