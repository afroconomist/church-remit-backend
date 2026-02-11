export type AddNewVolunteer = {
  name: string;
  email: string;
  phoneNumber: string;
  skills: string[] | string;
  availability: string[] | string;
  memberSince: Date;
  church: string;
  churchMemberId?: string;
};
