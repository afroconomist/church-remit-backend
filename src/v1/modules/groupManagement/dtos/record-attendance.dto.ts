export type RecordAttendance = {
  meetingDate: Date;
  guestCount: number;
  attended: number;
  absent: number;
  excused: number;
  guestNames: string[] | string;
  presentMembers: string[] | string;
  absentMembers: string[] | string;
  excusedMembers: string[] | string;
  meetingTopic: string;
  meetingNotes: Text;
  testimonies: Text;
  prayerRequests: Text;
  group: string;
};
