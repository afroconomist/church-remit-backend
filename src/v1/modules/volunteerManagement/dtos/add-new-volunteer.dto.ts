export type AddNewVolunteer = {
  name: string;
  email: string;
  phoneNumber: string;
  skills: string[] | string;
  availability: string[] | string;
  memberSince: Date;
  lastServed?: Date;
  campusId?: string;
  church: string;
  churchMemberId?: string;
};
