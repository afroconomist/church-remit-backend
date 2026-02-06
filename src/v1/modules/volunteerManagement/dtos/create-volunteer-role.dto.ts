export type CreateVolunteerRole = {
  name: string;
  section: string;
  scheduledDate: Date;
  noOfVolunteersNeeded: number;
  startTime: string;
  endTime: string;
  church: string;
  groupId?: string;
};
