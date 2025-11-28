export type CreateChurchAndUser = {
  churchName: string;
  churchType: string;
  email: string;
  phoneNumber: string;
  website: string | null;
  streetAddress: string;
  city: string;
  stateRegion: string;
  country: string;
  timeZone: string;
  baseCurrency: string;
  fiscalYearStart: Date;
  initialFundsToCreate: string[] | string;

  userFirstName?: string;
  userLastName?: string;
  userEmail?: string;
  userPassword?: string;
  userRole?: string;
  churchId?: string;
};
