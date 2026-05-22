import { DB_TABLES } from "@shared/enums/db-tables.enum";
import { Model, ModelObject } from "objection";

export class GroupMeetingAttendance extends Model {
  static tableName = DB_TABLES.GROUP_MEETING_ATTENDANCES;
  id: string;
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
}

export type IGroupMeetingAttendance = ModelObject<GroupMeetingAttendance>;
