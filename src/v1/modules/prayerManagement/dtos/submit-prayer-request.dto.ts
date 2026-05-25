export type SubmitPrayerRequest = {
  requestTitle: string;
  description: Text;
  category: string;
  urgency: string;
  privacySetting: string;
  assignedTo?: string;
  pray?: number;
  submittedBy?: string;
  prayerWarrior?: string;
  answered?: boolean;
  campusId?: string;
  church: string;
};
